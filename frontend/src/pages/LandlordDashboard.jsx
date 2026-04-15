import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Plus, Edit, Trash2, Calendar, MapPin, Clock, LayoutDashboard } from 'lucide-react';

const LandlordDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRes = await axios.get(`http://localhost:5000/api/rooms?ownerId=${user.id}`);
        setRooms(roomsRes.data);

        const bookingsRes = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to fetch landlord data', err);
      }
    };
    fetchData();
  }, [token, user.id]);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
    } catch (err) {
      console.error('Failed to update booking status', err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this property listing?')) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(rooms.filter(r => r.id !== roomId));
      } catch (err) {
        console.error('Failed to delete room', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">
                <LayoutDashboard className="w-4 h-4" />
                Landlord Portal
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight">Portfolio Manager</h1>
              <p className="text-slate-500 font-medium text-lg">You are currently managing {rooms.length} active property listings.</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <Link
                to="/landlord/rooms/new"
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
               >
                <Plus className="w-6 h-6" /> List New Property
               </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">

          {/* Main Portfolio Grid */}
          <div className="xl:col-span-8 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                Active Listings
              </h2>
              <Link to="/rooms" className="text-sm font-bold text-blue-600 hover:underline">View public browse page</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rooms.map(room => (
                <div key={room.id} className="group bg-white rounded-[3rem] p-4 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 relative flex flex-col">
                  <div className="relative h-56 overflow-hidden rounded-[2rem]">
                    {room.imageUrl ? (
                        <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                            <Home className="w-12 h-12 text-slate-200" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-2xl text-[10px] font-black text-blue-600 shadow-xl uppercase tracking-widest">
                       ${room.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-6 pb-2 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{room.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" /> {room.location}
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pb-4">
                      <button
                        onClick={() => navigate(`/landlord/rooms/edit/${room.id}`)}
                        className="flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="flex items-center justify-center gap-2 py-3.5 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-transparent hover:border-rose-200"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {rooms.length === 0 && (
                <div className="col-span-full bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-in zoom-in duration-700">
                   <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-300">
                      <Plus className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-3">No properties yet</h3>
                   <p className="text-slate-500 font-medium mb-10">Start by adding your first property to find tenants.</p>
                   <Link to="/landlord/rooms/new" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all">
                      Add Property Listing
                   </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recent Requests */}
          <div className="xl:col-span-4 space-y-10">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
              Incoming Requests
            </h2>

            <div className="space-y-6">
              {bookings.map(booking => (
                <div key={booking.id} className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-lg font-black text-slate-500 uppercase">
                         {booking.tenant?.username.charAt(0)}
                       </div>
                       <div>
                         <p className="text-sm font-black text-slate-900">{booking.tenant?.username}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">New Tenant Request</p>
                       </div>
                    </div>
                    {booking.status === 'pending' ? (
                       <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-100">Pending</span>
                    ) : (
                       <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                         booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                       }`}>{booking.status}</span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8 space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                       <Home className="w-4 h-4 text-blue-500" /> {booking.room?.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        className="flex-1 py-4 bg-white text-rose-600 border border-rose-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 active:scale-95 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                  <Clock className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs leading-relaxed">
                    No requests <br /> at the moment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
