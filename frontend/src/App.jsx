import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
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
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
