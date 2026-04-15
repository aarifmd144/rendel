import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Sparkles, CheckCircle2, Home } from 'lucide-react';

const RegisterPage = ({ role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        role
      });
      navigate(`/${role}/login`);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. This username might be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Visual Side */}
      <div className="hidden lg:flex relative overflow-hidden bg-slate-900 flex-col justify-between p-16 text-white">
        <div className="absolute top-0 right-0 w-full h-full -z-0">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[200px] opacity-20 translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[200px] opacity-20 -translate-x-1/2 translate-y-1/2" />
        </div>

        <Link to="/" className="inline-flex items-center gap-2 relative z-10 group w-fit">
           <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
             <Home className="text-white w-7 h-7" />
           </div>
           <span className="text-3xl font-black tracking-tight">RentalHub</span>
        </Link>

        <div className="relative z-10 space-y-8 max-w-lg">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-blue-400 text-xs font-black uppercase tracking-[0.2em]">
             <Sparkles className="w-4 h-4" /> Join our ecosystem
           </div>
           <h1 className="text-6xl font-black leading-tight tracking-tight">
             The easiest way to <span className="text-blue-500">rent and manage.</span>
           </h1>
           <div className="space-y-6 pt-8">
              {[
                'Instant property booking requests',
                'Secure role-based dashboards',
                'Advanced property analytics',
                'Verified tenant and owner community'
              ].map(benefit => (
                <div key={benefit} className="flex items-center gap-4 group">
                   <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                   </div>
                   <span className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">{benefit}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="relative z-10 text-slate-400 font-medium">
           © 2024 RentalHub Global Inc.
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 sm:p-16">
        <div className="max-w-md w-full animate-in slide-in-from-right duration-700">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{roleTitle} Signup</h2>
            <p className="text-lg text-slate-500 font-medium">Let's get your professional profile set up today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-sm font-bold animate-in shake-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-6">
               <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-blue-600 transition-colors">Choose Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-slate-900"
                      placeholder="e.g. john_doe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <User className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  </div>
               </div>

               <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-blue-600 transition-colors">Create Password</label>
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
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register for Portal <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account? <button onClick={() => navigate(`/${role}/login`)} className="text-blue-600 font-black hover:underline uppercase tracking-widest text-xs">Sign in here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
