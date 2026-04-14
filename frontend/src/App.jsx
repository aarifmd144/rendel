import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

const HomePage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 className="text-4xl font-bold mb-8">Rental House System</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">Tenants</h2>
        <Link to="/tenant/login" className="bg-blue-500 text-white px-4 py-2 rounded">Tenant Portal</Link>
      </div>
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">Landlords</h2>
        <Link to="/landlord/login" className="bg-green-500 text-white px-4 py-2 rounded">Landlord Portal</Link>
      </div>
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-4">Admin</h2>
        <Link to="/admin/login" className="bg-red-500 text-white px-4 py-2 rounded">Admin Portal</Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
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
