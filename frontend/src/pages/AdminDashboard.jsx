import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Home, BookOpen, Trash2, ShieldCheck, LogOut, ChevronRight, User as UserIcon } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { token, logout, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [usersRes, roomsRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users', config),
          axios.get('http://localhost:5000/api/rooms', config),
          axios.get('http://localhost:5000/api/bookings', config)
        ]);
        setUsers(usersRes.data);
        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setRooms(rooms.filter(r => r.id !== id));
      } catch (err) {
        alert('Failed to delete property');
      }
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Properties', value: rooms.length, icon: Home, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Bookings', value: bookings.length, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-custom">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-primary" size={32} />
              Admin Control Center
            </h1>
            <p className="text-slate-500 mt-1">Manage users, listings, and platform activity</p>
          </div>
          <button onClick={logout} className="btn-danger flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="card p-6 flex items-center gap-5">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex border-b border-slate-100">
            {[
              { id: 'users', label: 'Users', icon: Users },
              { id: 'rooms', label: 'Properties', icon: Home },
              { id: 'bookings', label: 'Bookings', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
              </button>
            ))}
          </div>

          <div className="p-0 overflow-x-auto">
            {activeTab === 'users' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">User Details</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Joined</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-700">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'landlord' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-slate-500 text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 text-right">
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'rooms' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Property</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Owner</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 font-bold text-slate-700">{r.title}</td>
                      <td className="px-8 py-4 text-slate-600 font-medium">{r.owner?.username}</td>
                      <td className="px-8 py-4 font-black text-primary">${r.price}</td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => handleDeleteRoom(r.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'bookings' && (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Room</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Tenant</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Dates</th>
                    <th className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 font-bold text-slate-700">{b.room?.title}</td>
                      <td className="px-8 py-4 text-slate-600 font-medium">{b.tenant?.username}</td>
                      <td className="px-8 py-4 text-sm text-slate-500">
                        {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
