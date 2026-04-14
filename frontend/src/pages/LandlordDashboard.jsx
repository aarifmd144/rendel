import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Plus, Edit, Trash2, Calendar, User, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Landlord Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your properties and rental requests.</p>
          </div>
          <Link
            to="/landlord/rooms/new"
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition shadow-md flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" /> List New Property
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Properties Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Home className="w-6 h-6 mr-2 text-blue-600" />
              My Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-40 bg-gray-200">
                    {room.imageUrl ? (
                        <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 italic">No image</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{room.title}</h3>
                      <span className="text-blue-600 font-bold">${room.price}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-3 h-3 mr-1" /> {room.location}
                    </div>
                    <div className="flex gap-2 border-t pt-4">
                      <button
                        onClick={() => navigate(`/landlord/rooms/edit/${room.id}`)}
                        className="flex-1 flex items-center justify-center py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="flex-1 flex items-center justify-center py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {rooms.length === 0 && (
                <div className="col-span-full bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                   <p className="text-gray-500">You haven't listed any properties yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              Recent Requests
            </h2>
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-900 truncate pr-2">{booking.room?.title}</h4>
                    {booking.status === 'pending' ? (
                       <span className="flex-shrink-0 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center">
                         <Clock className="w-3 h-3 mr-1" /> Pending
                       </span>
                    ) : (
                       <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center ${
                         booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                         {booking.status}
                       </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-3.5 h-3.5 mr-2 text-gray-400" />
                      <span>Tenant: <span className="font-medium text-gray-900">{booking.tenant?.username}</span></span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                      <span>{new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t">
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        className="flex-1 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        className="flex-1 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="bg-white p-6 rounded-2xl text-center text-gray-500 italic border border-dashed">
                  No booking requests received.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
