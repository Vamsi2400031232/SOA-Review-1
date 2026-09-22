// LocalStorage Keys
const KEYS = {
  MEMBERS: 'pulsefit_members',
  PLANS: 'pulsefit_plans',
  SUBSCRIPTIONS: 'pulsefit_subscriptions',
  ATTENDANCE: 'pulsefit_attendance',
  AUTH: 'pulsefit_auth',
  USERS: 'pulsefit_registered_users'
};

// Initial Seed Data with Indian Rupee (₹) pricing
const DEFAULT_PLANS = [
  { id: 'P001', name: 'Bronze Plan', price: 1499, durationMonths: 1, description: 'Gym access only, single location, standard hours.' },
  { id: 'P002', name: 'Silver Plan', price: 2999, durationMonths: 1, description: 'Gym & Group fitness classes access, single location.' },
  { id: 'P003', name: 'Gold Plan', price: 5999, durationMonths: 3, description: 'All-inclusive Gym, Pool, Sauna & Yoga. Multi-center access.' },
  { id: 'P004', name: 'Platinum VIP', price: 14999, durationMonths: 12, description: 'Unrestricted access, personal trainer sessions, towel service.' }
];

const DEFAULT_MEMBERS = [];

const DEFAULT_SUBSCRIPTIONS = [];

// Helper to seed attendance (empty initially)
const seedAttendance = () => [];

const STORAGE_VERSION = 'v3_inr_and_auth';

// Initialize Storage
const initStorage = () => {
  if (localStorage.getItem('pulsefit_data_version') !== STORAGE_VERSION) {
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify([]));
    localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify([]));
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
    localStorage.setItem(KEYS.PLANS, JSON.stringify(DEFAULT_PLANS));
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([]));
    }
    localStorage.setItem('pulsefit_data_version', STORAGE_VERSION);
  }
  if (!localStorage.getItem(KEYS.PLANS)) {
    localStorage.setItem(KEYS.PLANS, JSON.stringify(DEFAULT_PLANS));
  }
  if (!localStorage.getItem(KEYS.MEMBERS)) {
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.SUBSCRIPTIONS)) {
    localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.ATTENDANCE)) {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify([]));
  }
};

// Execute Initialization
initStorage();

// Data helper functions
const getFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const mockDb = {
  // --- Auth / User Registration ---
  getUsers: () => getFromStorage(KEYS.USERS),
  registerUser: (userData) => {
    const users = getFromStorage(KEYS.USERS);
    const existing = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase() || u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('User with this username or email already exists.');
    }
    
    const role = (userData.role || 'MEMBER').toUpperCase();
    const newUser = {
      id: `U${1000 + users.length + 1}`,
      name: userData.name || userData.username,
      username: userData.username,
      email: userData.email,
      phone: userData.phone || '',
      password: userData.password,
      role: role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveToStorage(KEYS.USERS, users);

    // If registered as Member, also automatically register a Member record
    if (role === 'MEMBER') {
      const members = getFromStorage(KEYS.MEMBERS);
      const existingMember = members.find(m => m.email.toLowerCase() === userData.email.toLowerCase());
      if (!existingMember) {
        const newMember = {
          id: `M${1000 + members.length + 1 + Math.floor(Math.random() * 100)}`,
          name: userData.name || userData.username,
          email: userData.email,
          phone: userData.phone || '9876543210',
          joinedDate: new Date().toISOString().split('T')[0],
          status: 'Pending'
        };
        members.push(newMember);
        saveToStorage(KEYS.MEMBERS, members);
      }
    }

    const token = 'mock-jwt-token-header.' + btoa(JSON.stringify({ sub: newUser.username, role: newUser.role, name: newUser.name })) + '.mock-signature';
    return { token, role: newUser.role, username: newUser.username, name: newUser.name, email: newUser.email };
  },

  loginUser: (username, password) => {
    // Check built-in mock credentials
    const validCredentials = {
      'admin': ['admin123', 'password', 'admin'],
      'staff': ['staff123', 'password', 'staff'],
      'member': ['member123', 'password', 'member']
    };

    const uname = (username || '').toLowerCase();
    if (validCredentials[uname] && validCredentials[uname].includes(password)) {
      const role = uname === 'admin' ? 'ADMIN' : (uname === 'staff' ? 'STAFF' : 'MEMBER');
      const token = 'mock-jwt-token-header.' + btoa(JSON.stringify({ sub: username, role })) + '.mock-signature';
      return { token, role, username, name: username.toUpperCase() };
    }

    // Check custom registered users
    const users = getFromStorage(KEYS.USERS);
    const user = users.find(u => (u.username.toLowerCase() === uname || u.email.toLowerCase() === uname) && u.password === password);
    if (user) {
      const token = 'mock-jwt-token-header.' + btoa(JSON.stringify({ sub: user.username, role: user.role, name: user.name })) + '.mock-signature';
      return { token, role: user.role, username: user.username, name: user.name, email: user.email };
    }

    throw new Error('Invalid username or password. For demo accounts use admin / admin123.');
  },
  // --- Members CRUD ---
  getMembers: () => getFromStorage(KEYS.MEMBERS),
  clearAllMembers: () => {
    saveToStorage(KEYS.MEMBERS, []);
    saveToStorage(KEYS.SUBSCRIPTIONS, []);
    saveToStorage(KEYS.ATTENDANCE, []);
  },
  saveMember: (member) => {
    const members = getFromStorage(KEYS.MEMBERS);
    if (member.id) {
      // Edit
      const index = members.findIndex(m => m.id === member.id);
      if (index !== -1) {
        members[index] = { ...members[index], ...member };
      }
    } else {
      // Create
      const newId = `M${1000 + members.length + 1 + Math.floor(Math.random() * 100)}`;
      const newMember = {
        ...member,
        id: newId,
        joinedDate: new Date().toISOString().split('T')[0],
        status: member.status || 'Pending'
      };
      members.push(newMember);
      saveToStorage(KEYS.MEMBERS, members);
      return newMember;
    }
    saveToStorage(KEYS.MEMBERS, members);
    return member;
  },
  deleteMember: (id) => {
    let members = getFromStorage(KEYS.MEMBERS);
    members = members.filter(m => m.id !== id);
    saveToStorage(KEYS.MEMBERS, members);
    // Also remove their subscriptions
    let subs = getFromStorage(KEYS.SUBSCRIPTIONS);
    subs = subs.filter(s => s.memberId !== id);
    saveToStorage(KEYS.SUBSCRIPTIONS, subs);
  },

  // --- Plans CRUD ---
  getPlans: () => getFromStorage(KEYS.PLANS),
  savePlan: (plan) => {
    const plans = getFromStorage(KEYS.PLANS);
    if (plan.id) {
      const index = plans.findIndex(p => p.id === plan.id);
      if (index !== -1) {
        plans[index] = { ...plans[index], ...plan };
      }
    } else {
      const newId = `P${100 + plans.length + 1}`;
      const newPlan = { ...plan, id: newId };
      plans.push(newPlan);
      saveToStorage(KEYS.PLANS, plans);
      return newPlan;
    }
    saveToStorage(KEYS.PLANS, plans);
    return plan;
  },
  deletePlan: (id) => {
    let plans = getFromStorage(KEYS.PLANS);
    plans = plans.filter(p => p.id !== id);
    saveToStorage(KEYS.PLANS, plans);
  },

  // --- Subscriptions & Renewals ---
  getSubscriptions: () => getFromStorage(KEYS.SUBSCRIPTIONS),
  renewSubscription: (memberId, planId, durationMonthsOverride) => {
    const members = getFromStorage(KEYS.MEMBERS);
    const plans = getFromStorage(KEYS.PLANS);
    const subs = getFromStorage(KEYS.SUBSCRIPTIONS);
    
    const member = members.find(m => m.id === memberId);
    const plan = plans.find(p => p.id === planId);
    
    if (!member || !plan) throw new Error('Member or Plan not found');
    
    // Expire past subscriptions for this member
    const updatedSubs = subs.map(s => {
      if (s.memberId === memberId && s.status === 'Active') {
        return { ...s, status: 'Expired' };
      }
      return s;
    });
    
    const duration = durationMonthsOverride || plan.durationMonths;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + duration);
    
    const newSub = {
      id: `S${2000 + updatedSubs.length + 1 + Math.floor(Math.random() * 100)}`,
      memberId,
      planId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'Active',
      paidAmount: plan.price
    };
    
    updatedSubs.push(newSub);
    saveToStorage(KEYS.SUBSCRIPTIONS, updatedSubs);
    
    // Update Member Status
    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex !== -1) {
      members[memberIndex].status = 'Active';
      saveToStorage(KEYS.MEMBERS, members);
    }
    
    return newSub;
  },

  // --- Attendance Turnstile ---
  getAttendanceLogs: () => getFromStorage(KEYS.ATTENDANCE),
  checkInMember: (memberId, center, area = 'Gym Floor') => {
    const members = getFromStorage(KEYS.MEMBERS);
    const subs = getFromStorage(KEYS.SUBSCRIPTIONS);
    const logs = getFromStorage(KEYS.ATTENDANCE);
    
    const member = members.find(m => m.id === memberId || m.email.toLowerCase() === memberId.toLowerCase());
    
    if (!member) {
      const failedLog = {
        id: `A${3000 + logs.length + 1}`,
        memberId: 'UNKNOWN',
        memberName: memberId,
        center,
        area,
        checkInTime: new Date().toISOString(),
        status: 'Denied',
        message: 'Member profile not found.'
      };
      logs.unshift(failedLog);
      saveToStorage(KEYS.ATTENDANCE, logs);
      return failedLog;
    }
    
    // Check if they have an active subscription
    const activeSub = subs.find(s => s.memberId === member.id && s.status === 'Active');
    let status = 'Allowed';
    let message = 'Access granted.';
    
    if (member.status === 'Expired' || !activeSub) {
      status = 'Denied';
      message = 'No active subscription plan found. Access denied.';
      
      // Update member status in database if currently marked active
      if (member.status === 'Active') {
        const idx = members.findIndex(m => m.id === member.id);
        members[idx].status = 'Expired';
        saveToStorage(KEYS.MEMBERS, members);
      }
    } else if (member.status === 'Pending') {
      status = 'Denied';
      message = 'Membership pending activation. Access denied.';
    } else {
      // Check if past expiry date
      const expiry = new Date(activeSub.endDate);
      const now = new Date();
      if (now > expiry) {
        status = 'Denied';
        message = 'Subscription expired. Access denied.';
        
        // Mark subscription expired
        const subIndex = subs.findIndex(s => s.id === activeSub.id);
        subs[subIndex].status = 'Expired';
        saveToStorage(KEYS.SUBSCRIPTIONS, subs);
        
        // Mark member expired
        const mIndex = members.findIndex(m => m.id === member.id);
        members[mIndex].status = 'Expired';
        saveToStorage(KEYS.MEMBERS, members);
      }
    }
    
    const newLog = {
      id: `A${3000 + logs.length + 1}`,
      memberId: member.id,
      memberName: member.name,
      center,
      area,
      checkInTime: new Date().toISOString(),
      status,
      message
    };
    
    logs.unshift(newLog);
    saveToStorage(KEYS.ATTENDANCE, logs);
    return newLog;
  }
};
