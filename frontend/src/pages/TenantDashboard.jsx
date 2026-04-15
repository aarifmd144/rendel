import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Home, History, Clock, CheckCircle2, XCircle, ArrowRight, MapPin, Search } from 'lucide-react';

const TenantDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const { token, user } = useAuth();
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
      }
    };
    fetchBookings();
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/10';
      default: return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Stats */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs mb-3">
                <div className="w-6 h-1 bg-blue-600 rounded-full" />
                Member Dashboard
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome back, {user?.username}</h1>
              <p className="text-slate-500 font-medium">Manage your rental requests and property history.</p>
            </div>
            <Link
              to="/rooms"
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 flex items-center gap-3 active:scale-95"
            >
              <Search className="w-5 h-5" /> Explore Properties
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Bookings</p>
                <p className="text-3xl font-black text-slate-900">{bookings.length}</p>
             </div>
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirmed</p>
                <p className="text-3xl font-black text-emerald-600">{bookings.filter(b => b.status === 'confirmed').length}</p>
             </div>
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pending</p>
                <p className="text-3xl font-black text-amber-500">{bookings.filter(b => b.status === 'pending').length}</p>
             </div>
          </div>
        </header>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Booking History</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookings.map(booking => (
                <div key={booking.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    {booking.room?.imageUrl ? (
                        <img src={booking.room.imageUrl} alt={booking.room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                           <Home className="w-12 h-12" />
                        </div>
                    )}
                    <div className={`absolute top-4 right-4 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-xl ${getStatusStyle(booking.status)}`}>
                      {getStatusIcon(booking.status)} {booking.status}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{booking.room?.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                      <MapPin className="w-3.5 h-3.5" /> {booking.room?.location}
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-slate-600 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                        <span className="text-sm font-bold">
                           {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                       <div className="text-lg font-black text-slate-900">
                         ${booking.room?.price}<span className="text-xs text-slate-400 font-bold ml-1">/mo</span>
                       </div>
                       <Link
                        to={`/rooms/${booking.roomId}`}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                       >
                         <ArrowRight className="w-5 h-5" />
                       </Link>
                    </div>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="col-span-full bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-in zoom-in duration-700">
                  <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">No active bookings</h3>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium mb-10">You haven't requested any properties yet. Start browsing to find your next dream home!</p>
                  <Link to="/rooms" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                    Start Browsing
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
