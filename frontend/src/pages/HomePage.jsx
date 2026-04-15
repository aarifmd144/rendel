import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Home, ArrowRight, Star, Shield, Clock } from 'lucide-react';

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        // Take the last 3 as featured
        setFeaturedRooms(response.data.slice(-3).reverse());
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      }
    };
    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/rooms?search=${searchQuery}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 h-[600px] flex items-center">
        <div className="absolute inset-0 opacity-40">
            <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80"
                alt="Modern living room"
                className="w-full h-full object-cover"
            />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Find Your Perfect <span className="text-primary">Stay</span> With Ease
            </h1>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed">
              Discover thousands of verified rental properties across the country. Simple booking, secure payments, and a home for every budget.
            </p>

            <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl">
              <div className="flex-grow flex items-center px-4 py-2 gap-3 text-slate-700">
                <Search size={24} className="text-primary" />
                <input
                  type="text"
                  placeholder="Enter city, location, or building..."
                  className="w-full outline-hidden text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary py-4 px-10 text-lg rounded-xl">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-primary mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
              <p className="text-text-muted">Every property is manually checked to ensure safety and authenticity.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-secondary mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Booking</h3>
              <p className="text-text-muted">Our streamlined process lets you secure your next home in minutes.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-accent mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Support</h3>
              <p className="text-text-muted">Dedicated support team available 24/7 to help with your rental journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title mb-2">Featured Properties</h2>
              <p className="text-text-muted">Handpicked selection of our top-rated properties this week.</p>
            </div>
            <Link to="/rooms" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map(room => (
              <div key={room.id} className="card group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.imageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
                    alt={room.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {room.propertyType || 'Apartment'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{room.title}</h3>
                    <div className="text-primary font-bold text-xl">${room.price}</div>
                  </div>
                  <div className="flex items-center gap-1 text-text-muted text-sm mb-4">
                    <MapPin size={14} />
                    <span>{room.location}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/rooms/${room.id}`)}
                    className="w-full btn-outline py-2.5"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-extrabold mb-6">Are You a Property Owner?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            List your properties with us and reach thousands of potential tenants every day.
            Enjoy seamless management and secure payments.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/landlord/register" className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
              List Your Property
            </Link>
            <Link to="/tenant/register" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              Find a Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
