import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CustomerAuthModal({ isOpen, onClose, onAuthSuccess, redirectAfter = null }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

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
      onClose();
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <span className="font-serif tracking-[0.22em] text-2xl font-black text-black uppercase block">
            KOCHEE
          </span>
          <h2 className="text-base font-bold uppercase tracking-wider text-black">
            {isLoginView ? 'CUSTOMER LOGIN' : 'CREATE AN ACCOUNT'}
          </h2>
          <p className="text-xs text-gray-500">
            {isLoginView
              ? 'Sign in with your Email ID and Password to proceed.'
              : 'Join Kochee Fragrance Luxe for order tracking & exclusive perks.'}
          </p>
        </div>

        {/* Toggle Pills */}
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
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
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
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black pl-9 placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-neutral-700 block mb-1 font-bold">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. rahul@example.com"
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
            {loading ? 'PROCESSING...' : (isLoginView ? 'SIGN IN' : 'CREATE ACCOUNT')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1 text-xs text-neutral-500">
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
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(true);
                  setError('');
                }}
                className="text-black font-bold underline hover:text-neutral-700"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

