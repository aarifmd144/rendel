import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Home, History, Clock, CheckCircle, XCircle } from 'lucide-react';

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
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'cancelled': return <XCircle className="w-4 h-4 mr-1" />;
      default: return <Clock className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Tenant Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-blue-600">{user?.username}</span>!</p>
          </div>
          <Link
            to="/rooms"
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-md flex items-center"
          >
            <Home className="w-4 h-4 mr-2" /> Browse More Rooms
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <section>
            <div className="flex items-center mb-6">
              <History className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">My Booking History</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">{booking.room?.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center border ${getStatusStyle(booking.status)}`}>
                        {getStatusIcon(booking.status)} {booking.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Price: <span className="font-semibold text-gray-900">${booking.room?.price}/mo</span>
                      </div>
                    </div>

                    <Link
                      to={`/rooms/${booking.roomId}`}
                      className="block w-full text-center py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                    >
                      View Property details
                    </Link>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="col-span-full bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">You haven't requested any rentals. Start browsing to find your next home!</p>
                  <Link to="/rooms" className="text-blue-600 font-bold hover:underline">Start Browsing</Link>
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
