import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, Calendar, Info, CheckCircle, AlertCircle, ArrowLeft, DollarSign } from 'lucide-react';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(response.data);
      } catch (err) {
        console.error('Failed to fetch room', err);
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

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        roomId: id,
        startDate,
        endDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Your booking request has been sent to the owner! Redirecting to dashboard...', type: 'success' });
      setTimeout(() => navigate('/tenant/dashboard'), 3000);
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Booking request failed. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!room) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Placeholder */}
            <div className="h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src={room.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"}
                alt={room.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {room.propertyType}
                    </span>
                    {room.isAvailable ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle size={12} /> Available
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <AlertCircle size={12} /> Occupied
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">{room.title}</h1>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-lg">{room.location}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center min-w-[150px]">
                  <p className="text-slate-500 text-sm mb-1 font-medium uppercase tracking-tighter">Monthly Rent</p>
                  <p className="text-3xl font-black text-primary">${room.price}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Info size={20} className="text-primary" />
                  Description
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                  {room.description || "No description provided for this property."}
                </p>
              </div>

              <div className="border-t border-slate-100 mt-8 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Listed by</p>
                    <p className="text-slate-800 font-bold text-lg">{room.owner?.username || 'Landlord'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Listing Date</p>
                    <p className="text-slate-800 font-bold text-lg">{new Date(room.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Book Property</h3>

              {!room.isAvailable ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-6 flex gap-3">
                  <AlertCircle className="shrink-0" size={20} />
                  <p className="text-sm font-medium">This property is currently not available for new bookings.</p>
                </div>
              ) : user?.role === 'landlord' || user?.role === 'admin' ? (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 mb-6 flex gap-3">
                  <Info className="shrink-0" size={20} />
                  <p className="text-sm font-medium">Owners and Admins cannot book properties. Please use a tenant account.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  {message.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium flex gap-3 ${
                      message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                      {message.text}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="date"
                        className="input-field pl-10"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Check-out Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="date"
                        className="input-field pl-10"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between text-slate-500">
                      <span>Monthly Rent</span>
                      <span>${room.price}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Service Fee</span>
                      <span>$0</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-xl text-slate-900">
                      <span>Total Due</span>
                      <span>${room.price}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !room.isAvailable}
                    className="w-full btn-primary py-4 text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Processing...' : 'Request to Book'}
                  </button>
                  <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-wider">
                    You won't be charged yet
                  </p>
                </form>
              )}

              {!user && (
                 <div className="mt-6 text-center">
                    <p className="text-slate-500 text-sm mb-4">Interested in this property?</p>
                    <button
                        onClick={() => navigate('/tenant/login')}
                        className="btn-outline w-full py-3"
                    >
                        Sign in to Book
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
