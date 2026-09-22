import React, { useState } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Subscriptions from './components/Subscriptions';
import Attendance from './components/Attendance';
import Architecture from './components/Architecture';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(api.auth.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
  };

  // If user is not authenticated, render Login Page
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render Page Component based on navigation state
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'members':
        return <Members user={user} />;
      case 'subscriptions':
        return <Subscriptions user={user} />;
      case 'attendance':
        return <Attendance user={user} />;
      case 'architecture':
        return <Architecture user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
}
