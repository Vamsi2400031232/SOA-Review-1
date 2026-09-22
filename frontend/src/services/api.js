import { mockDb } from './mockData';

// API Configuration pointing to Spring Cloud Gateway
export const apiConfig = {
  get baseUrl() {
    return localStorage.getItem('pulsefit_gateway_url') || 'http://localhost:8080/api';
  },
  set baseUrl(val) {
    localStorage.setItem('pulsefit_gateway_url', val);
  }
};

// JWT Helper Functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('pulsefit_jwt_token');
  return token
    ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
};

// Generic Fetch Wrapper with short timeout for responsive offline fallback
const request = async (path, options = {}) => {
  const url = `${apiConfig.baseUrl}${path}`;
  const headers = { ...getAuthHeaders(), ...options.headers };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `HTTP Error ${response.status}: ${response.statusText}`);
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[Gateway Offline] ${url} - falling back to local service:`, error.message);
    throw error;
  }
};

export const api = {
  auth: {
    login: async (username, password) => {
      try {
        const data = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
        if (data && data.token) {
          localStorage.setItem('pulsefit_jwt_token', data.token);
          localStorage.setItem('pulsefit_user_role', data.role || 'MEMBER');
          localStorage.setItem('pulsefit_username', data.username || username);
          localStorage.setItem('pulsefit_user_name', data.name || data.username || username);
          return api.auth.getCurrentUser();
        }
      } catch (err) {
        // Fallback to local authentication
        const data = mockDb.loginUser(username, password);
        localStorage.setItem('pulsefit_jwt_token', data.token);
        localStorage.setItem('pulsefit_user_role', data.role || 'MEMBER');
        localStorage.setItem('pulsefit_username', data.username || username);
        localStorage.setItem('pulsefit_user_name', data.name || data.username || username);
        return api.auth.getCurrentUser();
      }
    },
    register: async (userData) => {
      try {
        const data = await request('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
        return data;
      } catch (err) {
        // Fallback to local user registration
        const data = mockDb.registerUser(userData);
        return data;
      }
    },
    logout: () => {
      localStorage.removeItem('pulsefit_jwt_token');
      localStorage.removeItem('pulsefit_user_role');
      localStorage.removeItem('pulsefit_username');
      localStorage.removeItem('pulsefit_user_name');
    },
    getCurrentUser: () => {
      const token = localStorage.getItem('pulsefit_jwt_token');
      if (!token) return null;

      const lsRole = localStorage.getItem('pulsefit_user_role');
      const lsUsername = localStorage.getItem('pulsefit_username');
      const lsName = localStorage.getItem('pulsefit_user_name');

      const role = lsRole && lsRole !== 'undefined' ? lsRole : 'MEMBER';
      const username = lsUsername && lsUsername !== 'undefined' ? lsUsername : 'User';
      const name = lsName && lsName !== 'undefined' ? lsName : username;

      return { username, role, name };
    }
  },

  // --- Member Service ---
  members: {
    getAll: async () => {
      try {
        return await request('/members');
      } catch {
        return mockDb.getMembers();
      }
    },
    getById: async (id) => {
      try {
        return await request(`/members/${id}`);
      } catch {
        const members = mockDb.getMembers();
        return members.find(m => m.id === id) || null;
      }
    },
    create: async (memberData) => {
      try {
        return await request('/members', {
          method: 'POST',
          body: JSON.stringify(memberData)
        });
      } catch {
        return mockDb.saveMember(memberData);
      }
    },
    update: async (id, memberData) => {
      try {
        return await request(`/members/${id}`, {
          method: 'PUT',
          body: JSON.stringify(memberData)
        });
      } catch {
        return mockDb.saveMember({ ...memberData, id });
      }
    },
    delete: async (id) => {
      try {
        return await request(`/members/${id}`, {
          method: 'DELETE'
        });
      } catch {
        return mockDb.deleteMember(id);
      }
    },
    clearAll: async () => {
      try {
        return await request('/members/all', {
          method: 'DELETE'
        });
      } catch {
        return mockDb.clearAllMembers();
      }
    }
  },

  // --- Subscription Service ---
  plans: {
    getAll: async () => {
      try {
        return await request('/plans');
      } catch {
        return mockDb.getPlans();
      }
    },
    create: async (planData) => {
      try {
        return await request('/plans', {
          method: 'POST',
          body: JSON.stringify(planData)
        });
      } catch {
        return mockDb.savePlan(planData);
      }
    },
    update: async (id, planData) => {
      try {
        return await request(`/plans/${id}`, {
          method: 'PUT',
          body: JSON.stringify(planData)
        });
      } catch {
        return mockDb.savePlan({ ...planData, id });
      }
    },
    delete: async (id) => {
      try {
        return await request(`/plans/${id}`, {
          method: 'DELETE'
        });
      } catch {
        return mockDb.deletePlan(id);
      }
    },
    renew: async (memberId, planId, durationMonths) => {
      try {
        return await request('/subscriptions/renew', {
          method: 'POST',
          body: JSON.stringify({ memberId, planId, durationMonths })
        });
      } catch {
        return mockDb.renewSubscription(memberId, planId, durationMonths);
      }
    },
    getSubscriptions: async () => {
      try {
        return await request('/subscriptions');
      } catch {
        return mockDb.getSubscriptions();
      }
    }
  },

  // --- Attendance Service ---
  attendance: {
    getLogs: async () => {
      try {
        return await request('/attendance');
      } catch {
        return mockDb.getAttendanceLogs();
      }
    },
    checkIn: async (memberId, center, area) => {
      try {
        return await request('/attendance/checkin', {
          method: 'POST',
          body: JSON.stringify({ memberId, center, area })
        });
      } catch {
        return mockDb.checkInMember(memberId, center, area);
      }
    }
  }
};
