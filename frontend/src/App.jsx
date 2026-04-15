import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TenantDashboard from './pages/TenantDashboard';
import RoomBrowsingPage from './pages/RoomBrowsingPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import LandlordDashboard from './pages/LandlordDashboard';
import RoomFormPage from './pages/RoomFormPage';
import AdminDashboard from './pages/AdminDashboard';
import { Search, ShieldCheck, MapPin, Sparkles, ArrowRight, Home as HomeIcon, CheckCircle2, User as UserIcon } from 'lucide-react';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setFeaturedRooms(response.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="lg:flex lg:items-center lg:gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" /> Trusted by 50,000+ users
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
                Your Next Chapter <br />
                <span className="text-blue-600">Starts at Home.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover the most effortless way to find, book, and manage your rental properties.
                Modern living designed for you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/rooms" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                  Browse Properties
                </Link>
                <Link to="/landlord/register" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-lg shadow-sm hover:bg-gray-50 transition-all duration-300">
                  List Your Property
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Verified Owners</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:w-1/2 relative">
               <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070"
                    alt="Modern Home"
                    className="w-full aspect-[4/5] object-cover"
                  />
               </div>
               <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4 z-20 animate-bounce-slow">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Booked Successfully</p>
                    <p className="text-sm font-bold text-gray-900">Modern Loft, New York</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Featured Properties</h2>
              <p className="text-lg text-gray-600">Hand-picked premium spaces in the best neighborhoods.</p>
            </div>
            <Link to="/rooms" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all duration-300">
              View all 200+ properties <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map(room => (
              <div key={room.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  {room.imageUrl ? (
                    <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <HomeIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-blue-600 shadow-sm uppercase tracking-wider">
                    {room.propertyType}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
                    <MapPin className="w-4 h-4" /> {room.location}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {room.title}
                  </h3>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="text-2xl font-bold text-gray-900">
                      ${room.price.toLocaleString()}<span className="text-sm text-gray-400 font-normal italic"> /month</span>
                    </div>
                    <Link to={`/rooms/${room.id}`} className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {featuredRooms.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-xl text-gray-400 font-medium italic">New properties arriving soon. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges / How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Why RentalHub?</h2>
              <p className="text-lg text-gray-600">The safest way to rent, from search to sign-off.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8">
                  <Search className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Find with Confidence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Search through thousands of verified listings with precise filters to find your perfect fit.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-8">
                  <ShieldCheck className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Book with Ease</h3>
                <p className="text-gray-600 leading-relaxed">
                  Direct communication with owners and secure booking requests through our integrated system.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Anywhere</h3>
                <p className="text-gray-600 leading-relaxed">
                  A centralized dashboard for tenants and owners to keep track of every detail seamlessly.
                </p>
              </div>
           </div>
        </div>
      </section>

      {/* Role Portals Section */}
      <section className="py-24 bg-blue-600 rounded-[4rem] mx-4 sm:mx-8 mb-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of happy tenants and landlords today. Choose your portal to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/10">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">I'm a Tenant</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">Discover properties and manage your bookings effortlessly.</p>
              <Link to="/tenant/login" className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Tenant Portal
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/10">
                <HomeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">I'm a Landlord</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">List your spaces and reach verified tenants in minutes.</p>
              <Link to="/landlord/login" className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                Landlord Portal
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/10">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Admin Panel</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">System oversight and user management for administrators.</p>
              <Link to="/admin/login" className="w-full py-4 bg-white/20 text-white border border-white/30 rounded-2xl font-bold hover:bg-white/30 transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <HomeIcon className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">RentalHub</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 RentalHub Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/tenant/login" element={<LoginPage role="tenant" />} />
          <Route path="/tenant/register" element={<RegisterPage role="tenant" />} />

          <Route path="/landlord/login" element={<LoginPage role="landlord" />} />
          <Route path="/landlord/register" element={<RegisterPage role="landlord" />} />

          <Route path="/admin/login" element={<LoginPage role="admin" />} />

          <Route path="/tenant/dashboard" element={<ProtectedRoute role="tenant"><TenantDashboard /></ProtectedRoute>} />
          <Route path="/rooms" element={<RoomBrowsingPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/landlord/dashboard" element={<ProtectedRoute role="landlord"><LandlordDashboard /></ProtectedRoute>} />
          <Route path="/landlord/rooms/new" element={<ProtectedRoute role="landlord"><RoomFormPage /></ProtectedRoute>} />
          <Route path="/landlord/rooms/edit/:id" element={<ProtectedRoute role="landlord"><RoomFormPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
