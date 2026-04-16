import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Home, FileText, DollarSign, MapPin, Image, Type, CheckCircle, Info } from 'lucide-react';

const RoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    imageUrl: '',
    propertyType: 'Apartment',
    isAvailable: true
  });

  useEffect(() => {
    if (id) {
      const fetchRoom = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
          setFormData(response.data);
        } catch (err) {
          console.error('Failed to fetch room', err);
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert('Failed to save property. Please check your inputs.');
    }
  };

  const propertyTypes = ['Apartment', 'House', 'Studio', 'Villa', 'Room'];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container-custom max-w-3xl">
        <button
          onClick={() => navigate('/landlord/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-primary p-8 text-white">
            <h2 className="text-3xl font-black">{id ? 'Edit Property' : 'List New Property'}</h2>
            <p className="text-blue-100 mt-2">Fill in the details below to reach potential tenants.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Info size={20} className="text-primary" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Title</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      className="input-field pl-10"
                      placeholder="e.g. Modern 2-Bedroom Apartment in Downtown"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      className="input-field pl-10 appearance-none"
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Rent ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      className="input-field pl-10"
                      placeholder="e.g. 1200"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Location & Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      className="input-field pl-10"
                      placeholder="Full address, City, State"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Image URL</label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      className="input-field pl-10"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 text-slate-400" size={18} />
                    <textarea
                      className="input-field pl-10 h-32 py-3 resize-none"
                      placeholder="Describe your property (amenities, nearby attractions, etc.)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <input
                        type="checkbox"
                        id="isAvailable"
                        className="w-5 h-5 text-primary border-slate-300 rounded-sm focus:ring-primary"
                        checked={formData.isAvailable}
                        onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                    />
                    <label htmlFor="isAvailable" className="font-bold text-slate-700 cursor-pointer">
                        Currently Available for Rent
                    </label>
                </div>
              </div>
            </section>

            <div className="pt-6 border-t border-slate-100 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/landlord/dashboard')}
                className="flex-grow btn-outline py-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] btn-primary py-4 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                {id ? 'Update Property Listing' : 'Publish Property Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomFormPage;
