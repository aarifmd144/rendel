import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Info, DollarSign, MapPin, Type, Image as ImageIcon, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';

const RoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'Apartment',
    isAvailable: true,
    imageUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchRoom = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
          setFormData(response.data);
        } catch (err) {
          console.error('Failed to fetch room', err);
        }
      };
      fetchRoom();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/rooms/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/rooms', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/landlord/dashboard');
    } catch (err) {
      console.error('Failed to save room', err);
    } finally {
      setIsLoading(false);
    }
  };

  const propertyTypes = ['Apartment', 'House', 'Studio', 'Shared Room', 'Villa'];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        <Link
          to="/landlord/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-10 md:p-16">
            <header className="mb-12">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Home className="text-white w-7 h-7" />
                </div>
                {id ? 'Refine Listing' : 'Create New Listing'}
              </h2>
              <p className="text-slate-500 font-medium italic">Enter the property details to reach potential tenants.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2 group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-blue-600 transition-colors">Property Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Minimalist Loft in SoHo"
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-slate-900"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    <Info className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-blue-600 transition-colors">Property Type</label>
                  <div className="relative">
                    <select
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-slate-900 appearance-none"
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <Type className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-blue-600 transition-colors">Monthly Rent ($)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-slate-900"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                    <DollarSign className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="md:col-span-2 group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-blue-600 transition-colors">Location Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 742 Evergreen Terrace, Springfield"
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-slate-900"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                    <MapPin className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="md:col-span-2 group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-blue-600 transition-colors">Cover Image URL</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-slate-900"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                    <ImageIcon className="w-5 h-5 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Detailed Description</label>
                  <textarea
                    rows="5"
                    placeholder="Tell us more about the space, amenities, and surroundings..."
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all duration-300 font-medium text-slate-600"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <input
                  type="checkbox"
                  id="isAvailable"
                  className="w-6 h-6 text-blue-600 border-slate-300 rounded-lg focus:ring-blue-500 transition-all cursor-pointer"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                />
                <label htmlFor="isAvailable" className="ml-4 text-sm font-black text-blue-900 uppercase tracking-tight cursor-pointer">
                  Activate this listing immediately
                </label>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-500 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      {id ? 'Save Changes' : 'Publish Property'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFormPage;
