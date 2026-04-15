import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Home as HomeIcon, ArrowRight, X, ChevronRight } from 'lucide-react';

const RoomBrowsingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const clearFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('All');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-28 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                     <Filter className="w-5 h-5 text-blue-600" />
                   </div>
                   <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Location or Keywords</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
                      placeholder="e.g. New York, Modern..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Property Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {propertyTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setPropertyType(type)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          propertyType === type
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                        {propertyType === type && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Price Range ($)</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 p-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 p-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pro Tip</p>
                 <p className="text-sm font-medium leading-relaxed">
                   Filter by "Villa" in "Malibu" to see our most luxury listings this summer.
                 </p>
              </div>
            </div>
          </aside>

          {/* Main Listings Content */}
          <main className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <nav className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-2">
                   <Link to="/" className="hover:text-blue-600">Home</Link>
                   <ChevronRight className="w-3 h-3" />
                   <span className="text-slate-900">Browse Properties</span>
                </nav>
                <h1 className="text-4xl font-extrabold text-slate-900">
                  {filteredRooms.length} Spaces Found
                </h1>
              </div>

              <div className="flex items-center gap-3">
                 <button
                   onClick={() => setIsFilterOpen(true)}
                   className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 shadow-sm"
                 >
                   <Filter className="w-4 h-4" /> Filters
                 </button>
                 <select className="px-5 py-3 bg-white rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/10">
                    <option>Sort by: Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                 </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
              {filteredRooms.map(room => (
                <div key={room.id} className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                  <div className="relative h-64 overflow-hidden rounded-[2rem]">
                    {room.imageUrl ? (
                        <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                            <HomeIcon className="w-12 h-12 text-slate-200" />
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-[10px] font-black text-blue-600 shadow-sm uppercase tracking-[0.2em]">
                            {room.propertyType}
                        </span>
                    </div>
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                       </svg>
                    </button>
                  </div>

                  <div className="p-4 pt-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" /> {room.location}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-snug">
                      {room.title}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="text-2xl font-black text-slate-900">
                        ${room.price.toLocaleString()}<span className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">/mo</span>
                      </div>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all duration-300 transform group-hover:translate-x-1 flex items-center gap-2"
                      >
                        Details <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No matching properties found</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">
                  We couldn't find any listings that match your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-8 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-2xl font-bold text-slate-900">Filters</h2>
               <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
               </button>
            </div>
            {/* Filter Content Re-used here */}
            <div className="space-y-10 overflow-y-auto flex-1 pr-2">
               {/* Search, Type, Price same as sidebar */}
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none"
                    placeholder="Where to?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setPropertyType(type)}
                        className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                          propertyType === type ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="mt-10 w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              Show {filteredRooms.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for check icon
const CheckCircle2 = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default RoomBrowsingPage;
