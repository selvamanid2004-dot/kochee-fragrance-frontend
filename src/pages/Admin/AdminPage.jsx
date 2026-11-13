import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';

export default function AdminPage({ onNavigate }) {
  const { isAuthenticated, currentUser, isAdmin, login } = useAuth();
  const [email, setEmail] = useState('admin@kocheefragrance.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Only allow access if authenticated as an Administrator
  if (isAdmin) {
    return <AdminDashboard onNavigate={onNavigate} />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.user?.role !== 'admin') {
        throw new Error('Access denied. Administrator privileges required.');
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <span className="font-serif tracking-[0.25em] text-2xl font-black text-black uppercase block">
            KOCHEE
          </span>
          <h2 className="text-lg font-bold text-black uppercase tracking-wider">
            ADMIN CONSOLE LOGIN
          </h2>
          <p className="text-xs text-gray-500">
            Internal administrative portal for live stock, orders, catalog and CMS management.
          </p>
        </div>

        {isAuthenticated && !isAdmin && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <span className="font-bold block text-amber-950 mb-0.5">Customer Account Detected</span>
            You are currently signed in as <strong>{currentUser?.email}</strong>. The Admin Panel requires Administrator credentials. Please log in as admin below.
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-gray-700 block mb-1 font-bold">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-black pl-9 placeholder-gray-400 focus:outline-none focus:border-black"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-gray-700 block mb-1 font-bold">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-black pl-9 placeholder-gray-400 focus:outline-none focus:border-black"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="p-3 rounded bg-gray-50 border border-gray-200 text-[11px] text-gray-600 space-y-0.5">
            <span className="font-bold text-black block">Default Admin Credentials:</span>
            <p>Email: <span className="font-bold text-black">admin@kocheefragrance.com</span></p>
            <p>Password: <span className="font-bold text-black">admin123</span></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs transition flex items-center justify-center gap-2 shadow"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN TO ADMIN'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
