import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Home as HomeIcon } from 'lucide-react';

const RoomBrowsingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setRooms(response.data);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(search.toLowerCase()) ||
                         room.location.toLowerCase().includes(search.toLowerCase());
    const matchesMinPrice = minPrice === '' || room.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || room.price <= parseFloat(maxPrice);
    const matchesType = propertyType === 'All' || room.propertyType === propertyType;

    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesType && room.isAvailable;
  });

  const propertyTypes = ['All', 'Apartment', 'House', 'Studio', 'Shared Room', 'Villa'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 bg-white p-6 rounded-xl shadow-md h-fit">
            <div className="flex items-center mb-6 text-gray-800">
              <Filter className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-bold">Filters</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Location, title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSearch('');
                  setMinPrice('');
                  setMaxPrice('');
                  setPropertyType('All');
                }}
                className="w-full text-blue-600 font-medium text-sm hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Available Properties</h1>
              <p className="text-gray-500">{filteredRooms.length} results found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map(room => (
                <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-gray-200 relative">
                    {room.imageUrl ? (
                        <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 italic">No Image Available</div>
                    )}
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm uppercase tracking-wide">
                            {room.propertyType}
                        </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{room.title}</h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-3 h-3 mr-1" />
                      {room.location}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-xl font-bold text-gray-900">
                        ${room.price}<span className="text-xs text-gray-500 font-normal"> /mo</span>
                      </div>
                      <button
                        onClick={() => navigate(`/rooms/${room.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="bg-white p-12 rounded-xl text-center shadow-sm">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No matching properties</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms to find what you're looking for.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default RoomBrowsingPage;
