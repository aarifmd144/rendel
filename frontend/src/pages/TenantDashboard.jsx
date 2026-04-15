import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, CheckCircle, Clock, XCircle, Home, ArrowRight, User } from 'lucide-react';

const TenantDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active/Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container-custom">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Welcome, {user?.username}!</h1>
              <p className="text-slate-500">Manage your rental applications and history</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate('/rooms')}
              className="flex-grow md:flex-grow-0 btn-primary flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Browse Rooms
            </button>
            <button onClick={logout} className="btn-danger flex items-center justify-center gap-2">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="card p-6 flex items-center gap-5">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Bookings List */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">My Rental Requests</h2>
            </div>

            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="card overflow-hidden flex flex-col md:flex-row group">
                  <div className="md:w-48 h-48 md:h-auto overflow-hidden shrink-0">
                    <img
                      src={booking.room?.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80"}
                      alt={booking.room?.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/rooms/${booking.room?.id}`)}>
                          {booking.room?.title}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                          <MapPin size={14} />
                          <span>{booking.room?.location}</span>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status === 'confirmed' ? <CheckCircle size={14}/> :
                         booking.status === 'cancelled' ? <XCircle size={14}/> : <Clock size={14}/>}
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                          <Calendar size={16} className="text-primary" />
                          <span>{new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="text-primary font-black text-lg">
                            ${booking.room?.price}<span className="text-xs text-slate-400">/mo</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/rooms/${booking.room?.id}`)}
                        className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm"
                      >
                        View Property <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Home size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No bookings found</h3>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto">Ready to find your next home? Start browsing our verified property listings.</p>
                  <button
                    onClick={() => navigate('/rooms')}
                    className="btn-primary px-8"
                  >
                    Find a Property
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Sidebar */}
          <div className="lg:w-80 shrink-0">
             <div className="card p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
                <h3 className="text-lg font-bold mb-4">Account Support</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Have questions about a booking or a property? Our support team is here to help 24/7.
                </p>
                <div className="space-y-3">
                    <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold transition-colors">
                        Contact Support
                    </button>
                    <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold transition-colors">
                        Rental Guidelines
                    </button>
                </div>
             </div>

             <div className="card p-6 mt-6 border-slate-200">
                <h3 className="text-lg font-bold mb-4 text-slate-800">Quick Tips</h3>
                <ul className="space-y-4">
                    <li className="flex gap-3 text-sm">
                        <div className="shrink-0 w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center text-primary font-bold">1</div>
                        <p className="text-slate-600">Complete your profile to increase trust with owners.</p>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <div className="shrink-0 w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center text-primary font-bold">2</div>
                        <p className="text-slate-600">Always check the property details and location thoroughly.</p>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <div className="shrink-0 w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center text-primary font-bold">3</div>
                        <p className="text-slate-600">Communicate only through the platform for safety.</p>
                    </li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
