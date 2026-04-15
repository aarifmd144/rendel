import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Filter, X, ChevronRight } from 'lucide-react';

const RoomBrowsingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    availability: 'all'
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchFromUrl = queryParams.get('search') || '';
    if (searchFromUrl) {
      setFilters(prev => ({ ...prev, search: searchFromUrl }));
    }

    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setRooms(response.data);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [location.search]);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         room.location.toLowerCase().includes(filters.search.toLowerCase());
    const matchesMinPrice = filters.minPrice === '' || room.price >= parseFloat(filters.minPrice);
    const matchesMaxPrice = filters.maxPrice === '' || room.price <= parseFloat(filters.maxPrice);
    const matchesType = filters.propertyType === '' || room.propertyType === filters.propertyType;
    const matchesAvailability = filters.availability === 'all' ||
                               (filters.availability === 'available' && room.isAvailable) ||
                               (filters.availability === 'unavailable' && !room.isAvailable);

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesType && matchesAvailability;
  });

  const propertyTypes = ['Apartment', 'House', 'Studio', 'Villa', 'Room'];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Filter size={20} className="text-primary" />
                  Filters
                </h3>
                <button
                  onClick={() => setFilters({search: '', minPrice: '', maxPrice: '', propertyType: '', availability: 'all'})}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="City or title..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-hidden"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-hidden"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-hidden"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Property Type</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-hidden"
                    value={filters.propertyType}
                    onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Availability</label>
                  <div className="space-y-2">
                    {['all', 'available', 'unavailable'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="availability"
                          className="w-4 h-4 text-primary focus:ring-primary/20"
                          checked={filters.availability === opt}
                          onChange={() => setFilters({...filters, availability: opt})}
                        />
                        <span className="text-sm text-slate-600 group-hover:text-primary capitalize">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {filteredRooms.length} {filteredRooms.length === 1 ? 'Property' : 'Properties'} Found
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-white h-80 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredRooms.map(room => (
                  <div key={room.id} className="card group flex flex-col h-full">
                    <div className="relative h-56 shrink-0 overflow-hidden">
                      <img
                        src={room.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
                        alt={room.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {room.propertyType}
                      </div>
                      {!room.isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-bold text-lg">
                          Occupied
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">
                          {room.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{room.location}</span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-primary">${room.price}</span>
                          <span className="text-slate-400 text-sm ml-1">/mo</span>
                        </div>
                        <button
                          onClick={() => navigate(`/rooms/${room.id}`)}
                          className="flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all"
                        >
                          Details <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No properties match your filters</h3>
                <p className="text-slate-500 mb-6">Try adjusting your search criteria or reset filters to see all available listings.</p>
                <button
                  onClick={() => setFilters({search: '', minPrice: '', maxPrice: '', propertyType: '', availability: 'all'})}
                  className="btn-primary"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBrowsingPage;
