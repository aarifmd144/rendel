import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, ArrowRight, ShieldCheck, Home } from 'lucide-react';

const LoginPage = ({ role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
        role
      });
      login(response.data.user, response.data.token);
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="max-w-md w-full">
        {/* Branding/Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top duration-700">
           <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-xl shadow-blue-500/20">
                <Home className="text-white w-7 h-7" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
                RentalHub
              </span>
            </Link>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{roleTitle} Portal</h2>
            <p className="text-slate-500 font-medium italic">Welcome back! Please enter your details.</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 ring-1 ring-slate-200/50 animate-in zoom-in duration-500">
          {error && (
            <div className="mb-8 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-sm font-bold flex items-center gap-3 animate-in shake-in duration-300">
              <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-blue-600 transition-colors">Username</label>
                <div className="relative">
                   <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-slate-900"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <User className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center justify-between mb-3">
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-blue-600 transition-colors">Password</label>
                   <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                   <input
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-slate-900"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-900/10 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign in to Portal <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {role !== 'admin' && (
            <div className="mt-10 pt-10 border-t border-slate-50 text-center">
              <p className="text-slate-500 font-medium">
                New to RentalHub? <button onClick={() => navigate(`/${role}/register`)} className="text-blue-600 font-black hover:underline uppercase tracking-widest text-xs">Create {role} account</button>
              </p>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
           </div>
           <div className="w-1 h-1 bg-slate-400 rounded-full" />
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest">Support Portal</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
