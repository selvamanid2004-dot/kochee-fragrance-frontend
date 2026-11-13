import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage({ onNavigate }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          throw new Error('Please enter your full name');
        }
        await register(formData.name, formData.email, formData.password);
      }
      onNavigate('account');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-gray-50 text-black">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-xl">
        <button
          onClick={() => onNavigate('back')}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Boutique
        </button>

        <div className="text-center space-y-1">
          <span className="font-serif tracking-[0.25em] text-2xl font-black text-black uppercase block">
            KOCHEE
          </span>
          <h2 className="text-lg font-bold text-black uppercase tracking-wider">
            {isLoginView ? 'CUSTOMER LOGIN' : 'CUSTOMER SIGN UP'}
          </h2>
          <p className="text-xs text-gray-500">
            {isLoginView
              ? 'Access your orders, tracking, and personal fragrance collection.'
              : 'Sign up for express checkout, order history, and exclusive restock alerts.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border border-neutral-200 rounded-xl p-1 bg-neutral-100 text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => {
              setIsLoginView(true);
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
              isLoginView ? 'bg-black text-white shadow-md' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginView(false);
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
              !isLoginView ? 'bg-black text-white shadow-md' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLoginView && (
            <div>
              <label className="text-neutral-700 block mb-1 font-bold">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black pl-9 placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-neutral-700 block mb-1 font-bold">Email ID *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. vikram@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black pl-9 placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-neutral-700 block mb-1 font-bold">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter password (minimum 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black pl-9 placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? 'AUTHENTICATING...' : (isLoginView ? 'LOG IN' : 'CREATE ACCOUNT')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-neutral-500">
          {isLoginView ? (
            <p>
              New customer?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(false);
                  setError('');
                }}
                className="text-black font-bold underline hover:text-neutral-700"
              >
                Sign up for an account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(true);
                  setError('');
                }}
                className="text-black font-bold underline hover:text-neutral-700"
              >
                Log in to account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

