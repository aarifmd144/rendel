import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Plus, LogOut, Trash2, Edit2, Users, Check, X, Calendar, MapPin, DollarSign } from 'lucide-react';

const LandlordDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRes = await axios.get('http://localhost:5000/api/rooms');
        const landlordId = JSON.parse(localStorage.getItem('user')).id;
        setRooms(roomsRes.data.filter(r => r.ownerId === landlordId));

        const bookingsRes = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to fetch landlord data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(rooms.filter(r => r.id !== roomId));
      } catch (err) {
        alert('Failed to delete room');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container-custom">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Home className="text-primary" size={32} />
              Owner Portal
            </h1>
            <p className="text-slate-500 mt-1">Manage your properties and review booking requests</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/landlord/rooms/new')}
              className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Plus size={20} />
              Add New Property
            </button>
            <button onClick={logout} className="btn-danger flex items-center gap-2">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Properties Section */}
          <div className="xl:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">My Listings</h2>
              <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">{rooms.length} Total</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="card group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
                      alt={room.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/landlord/rooms/edit/${room.id}`)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-black text-primary">
                        ${room.price}/mo
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 truncate">{room.title}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                      <MapPin size={14} />
                      <span className="truncate">{room.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {room.isAvailable ? 'Available' : 'Occupied'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{room.propertyType}</span>
                    </div>
                  </div>
                </div>
              ))}
              {rooms.length === 0 && (
                <div className="col-span-2 bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                  <Home size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">You haven't listed any properties yet.</p>
                  <button
                    onClick={() => navigate('/landlord/rooms/new')}
                    className="mt-4 text-primary font-bold hover:underline"
                  >
                    Start Listing Today
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Recent Inquiries</h2>
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="card p-5 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">{booking.room?.title}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Users size={14} /> {booking.tenant?.username}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-primary" />
                      <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-primary" />
                      <span>{new Date(booking.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        className="flex-grow btn-secondary py-2 text-xs flex items-center justify-center gap-1"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        className="flex-grow btn-outline border-red-500 text-red-500 hover:bg-red-500 py-2 text-xs flex items-center justify-center gap-1"
                      >
                        <X size={14} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-100">
                  <Calendar size={32} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-sm text-slate-400">No booking requests received yet.</p>
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
