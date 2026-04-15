import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, CheckCircle2, Info, ArrowLeft, Share2, Heart, ShieldCheck, Star, Users, Home } from 'lucide-react';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
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
    window.scrollTo(0, 0);
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
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-50 opacity-20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Gallery/Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
           <button
             onClick={() => navigate(-1)}
             className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
           >
             <ArrowLeft className="w-4 h-4" /> Back to results
           </button>
           <div className="flex items-center gap-3">
              <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 border rounded-2xl transition-all ${
                  isLiked
                    ? 'bg-red-50 border-red-100 text-red-500 shadow-lg shadow-red-500/10'
                    : 'bg-white border-gray-100 text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Main Image */}
            <div className="aspect-[16/9] bg-gray-50 rounded-[3rem] overflow-hidden shadow-2xl relative">
              {room.imageUrl ? (
                <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                  <Home className="w-20 h-20" />
                  <p className="font-bold text-lg">No interior photos provided yet</p>
                </div>
              )}
              <div className="absolute bottom-8 left-8 flex gap-3">
                 <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-xs font-black text-blue-600 shadow-xl uppercase tracking-widest">
                   {room.propertyType}
                 </span>
                 <span className={`bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-xs font-black shadow-xl uppercase tracking-widest flex items-center gap-2 ${
                   room.isAvailable ? 'text-green-600' : 'text-red-600'
                 }`}>
                   <div className={`w-2 h-2 rounded-full animate-pulse ${room.isAvailable ? 'bg-green-600' : 'bg-red-600'}`} />
                   {room.isAvailable ? 'Available Now' : 'Booked'}
                 </span>
              </div>
            </div>

            {/* Title & Info Header */}
            <div className="border-b border-gray-100 pb-12">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {room.title}
              </h1>
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <MapPin className="text-blue-600 w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-600 uppercase tracking-widest text-xs">{room.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Users className="text-indigo-600 w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-600 uppercase tracking-widest text-xs">Verified Landlord</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-500 font-black tracking-widest text-xs">
                  <Star className="w-5 h-5 fill-current" />
                  4.8 <span className="text-gray-400 font-bold">(12 Reviews)</span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
               {[
                 { label: 'Bedrooms', value: '2', icon: '🛏️' },
                 { label: 'Bathrooms', value: '1', icon: '🚿' },
                 { label: 'Area', value: '85m²', icon: '📐' },
                 { label: 'Security', value: 'High', icon: '🛡️' }
               ].map(f => (
                 <div key={f.label} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{f.label}</p>
                    <p className="text-lg font-black text-gray-900">{f.value}</p>
                 </div>
               ))}
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                <Info className="w-6 h-6 text-blue-600" />
                Property Highlights
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {room.description || "An incredible opportunity to live in one of the city's most vibrant neighborhoods. This modern space offers floor-to-ceiling windows, premium appliances, and a layout designed for maximum comfort and style."}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-extrabold text-gray-900">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {['Fast Wi-Fi', 'Kitchen Access', 'Air Conditioning', 'Washing Machine', 'Workspace', 'Parking Space'].map(item => (
                   <div key={item} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-700">{item}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Owner Profile Card */}
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-2xl">
                {room.owner?.username.charAt(0).toUpperCase()}
              </div>
              <div className="relative z-10 flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h3 className="text-2xl font-bold">{room.owner?.username}</h3>
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-slate-400 font-medium mb-6">Property Manager since 2021 • Response rate: 98%</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">Identity Verified</div>
                   <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">Super Owner</div>
                </div>
              </div>
              <button className="relative z-10 w-full md:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-xl">
                 Contact Owner
              </button>
            </div>
          </div>

          {/* Sidebar - Booking Section */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-50 ring-1 ring-gray-100 relative overflow-hidden">
               {/* Accent */}
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

               <div className="flex items-end gap-2 mb-10">
                 <span className="text-5xl font-black text-gray-900 tracking-tight">${room.price.toLocaleString()}</span>
                 <span className="text-lg text-gray-400 font-bold mb-1.5 italic">/ month</span>
               </div>

               {(!user || user.role === 'tenant') && room.isAvailable ? (
                <form onSubmit={handleBooking} className="space-y-8">
                  <div className="p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-1">
                    <div className="p-5 border-b border-gray-200">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Move-in Date</label>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                        <input
                          type="date"
                          className="bg-transparent w-full text-sm font-bold text-gray-900 focus:outline-none"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="p-5">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Lease End Date</label>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
                        <input
                          type="date"
                          className="bg-transparent w-full text-sm font-bold text-gray-900 focus:outline-none"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-sm font-bold text-center animate-in zoom-in duration-300">
                      {message}
                    </div>
                  )}
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-bold text-center animate-in shake-in duration-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                  >
                    Send Booking Request
                  </button>

                  <div className="space-y-4 pt-4">
                     <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                       You won't be charged yet
                     </p>
                     <div className="flex items-center justify-between text-gray-600 font-medium">
                        <span>Cleaning fee</span>
                        <span>$80.00</span>
                     </div>
                     <div className="flex items-center justify-between text-gray-600 font-medium">
                        <span>Service fee</span>
                        <span>$12.00</span>
                     </div>
                     <div className="h-px bg-gray-100" />
                     <div className="flex items-center justify-between text-gray-900 font-black text-lg">
                        <span>Total Estimate</span>
                        <span>${(room.price + 92).toLocaleString()}</span>
                     </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-red-50 rounded-3xl border border-red-100 text-center">
                    <p className="text-red-700 font-bold">This property is currently unavailable for booking.</p>
                  </div>
                  {user?.role === 'landlord' && user.id === room.ownerId && (
                    <button
                      onClick={() => navigate(`/landlord/rooms/edit/${room.id}`)}
                      className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        Edit Property Listing
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/rooms')}
                    className="w-full py-5 border border-gray-200 text-gray-700 rounded-[2rem] font-bold hover:bg-gray-50 transition-all"
                  >
                    Browse similar listings
                  </button>
                </div>
              )}

              <div className="mt-8 p-6 bg-indigo-50 rounded-[2rem] flex items-center gap-4 border border-indigo-100">
                 <ShieldCheck className="text-indigo-600 w-8 h-8 shrink-0" />
                 <p className="text-xs font-bold text-indigo-800 leading-relaxed uppercase tracking-tight">
                   RentalHub Identity <br /> Protection Guaranteed
                 </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
