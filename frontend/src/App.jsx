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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-6">Find Your Perfect Home</h1>
          <p className="text-xl mb-8">Modern, comfortable, and affordable rentals at your fingertips.</p>
          <Link to="/rooms" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition">
            Browse All Properties
          </Link>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRooms.map(room => (
            <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:-translate-y-1 hover:shadow-2xl">
              <div className="h-48 bg-gray-300">
                {room.imageUrl ? (
                  <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 italic">No Image</div>
                )}
              </div>
              <div className="p-6">
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{room.propertyType}</span>
                <h3 className="text-xl font-bold mt-2 mb-2">{room.title}</h3>
                <p className="text-gray-600 mb-4">{room.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${room.price}<span className="text-sm text-gray-500 font-normal">/mo</span></span>
                  <Link to={`/rooms/${room.id}`} className="text-blue-600 font-medium hover:underline">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {featuredRooms.length === 0 && (
          <p className="text-center text-gray-500 italic">No properties available yet. Check back later!</p>
        )}
      </div>

      {/* Portals Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <h2 className="text-2xl font-bold mb-4">Are you a Tenant?</h2>
              <p className="text-gray-600 mb-6">Find and book your next dream home with ease.</p>
              <Link to="/tenant/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Tenant Portal</Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <h2 className="text-2xl font-bold mb-4">Are you a Landlord?</h2>
              <p className="text-gray-600 mb-6">List your property and manage bookings effortlessly.</p>
              <Link to="/landlord/login" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Landlord Portal</Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <h2 className="text-2xl font-bold mb-4">Administration</h2>
              <p className="text-gray-600 mb-6">Manage users, listings, and the entire system.</p>
              <Link to="/admin/login" className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">Admin Portal</Link>
            </div>
          </div>
        </div>
      </div>
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
