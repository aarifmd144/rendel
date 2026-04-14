import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, User as UserIcon, Calendar, CheckCircle, Info } from 'lucide-react';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(response.data);
      } catch (err) {
        console.error('Failed to fetch room details', err);
      }
    };
    fetchRoom();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!token) {
        navigate('/tenant/login');
        return;
    }
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        roomId: id,
        startDate,
        endDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Booking request sent successfully!');
      setTimeout(() => navigate('/tenant/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  if (!room) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="h-96 md:h-auto bg-gray-200">
              {room.imageUrl ? (
                <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 italic">
                   No images available for this property
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {room.propertyType}
                </span>
                {room.isAvailable ? (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Available
                    </span>
                ) : (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        Unavailable
                    </span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{room.title}</h1>
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-4 h-4 mr-2" />
                {room.location}
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-8">
                ${room.price} <span className="text-lg text-gray-500 font-normal">/ month</span>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center mb-2">
                    <Info className="w-5 h-5 mr-2 text-blue-500" /> Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{room.description || "No description provided."}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Owner Information</h3>
                  <div className="flex items-center">
                    <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
                      {room.owner?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{room.owner?.username}</p>
                      <p className="text-sm text-gray-500 italic">Property Landlord</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              {(!user || user.role === 'tenant') && room.isAvailable && (
                <form onSubmit={handleBooking} className="border-t pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-500" /> Book this property
                  </h3>

                  {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">{message}</div>}
                  {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lease End Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg"
                  >
                    Send Booking Request
                  </button>
                  <p className="text-center text-gray-400 text-xs mt-4 italic">
                    By clicking "Send Booking Request", you are expressing interest in this property.
                  </p>
                </form>
              )}

              {user?.role === 'landlord' && user.id === room.ownerId && (
                  <div className="mt-8">
                      <button
                        onClick={() => navigate(`/landlord/rooms/edit/${room.id}`)}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
                      >
                          Edit Property Listing
                      </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
