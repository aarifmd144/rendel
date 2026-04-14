import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Info, DollarSign, MapPin, Type, Image as ImageIcon } from 'lucide-react';

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
    }
  };

  const propertyTypes = ['Apartment', 'House', 'Studio', 'Shared Room', 'Villa'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
            <Home className="w-8 h-8 mr-3 text-blue-600" />
            {id ? 'Edit Property' : 'List New Property'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-1 text-gray-400" /> Title
              </label>
              <input
                type="text"
                placeholder="e.g. Cozy Studio in Downtown"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <Type className="w-4 h-4 mr-1 text-gray-400" /> Property Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-gray-400" /> Price (per month)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" /> Location
              </label>
              <input
                type="text"
                placeholder="e.g. 123 Main St, New York, NY"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <ImageIcon className="w-4 h-4 mr-1 text-gray-400" /> Image URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                rows="4"
                placeholder="Describe your property..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              />
              <label htmlFor="isAvailable" className="ml-3 text-sm font-medium text-gray-700">
                Mark as available for booking
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center"
              >
                {id ? 'Update Property' : 'Publish Listing'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/landlord/dashboard')}
                className="w-full mt-4 text-gray-500 font-medium hover:text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomFormPage;
