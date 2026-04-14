import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Home, Calendar, Trash2, LayoutDashboard, Search } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const usersRes = await axios.get('http://localhost:5000/api/users', config);
        setUsers(usersRes.data);
        const roomsRes = await axios.get('http://localhost:5000/api/rooms', config);
        setRooms(roomsRes.data);
        const bookingsRes = await axios.get('http://localhost:5000/api/bookings', config);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };
    fetchData();
  }, [token]);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user account? This cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error('Delete user failed', err);
      }
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Delete this property listing?')) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setRooms(rooms.filter(r => r.id !== id));
      } catch (err) {
        console.error('Delete room failed', err);
      }
    }
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4 mr-2" /> },
    { id: 'rooms', label: 'Properties', icon: <Home className="w-4 h-4 mr-2" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <LayoutDashboard className="w-8 h-8 mr-3 text-red-600" />
            Admin Control Panel
          </h1>
          <p className="text-gray-500 mt-1">System-wide management of users, listings, and bookings.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Properties</p>
            <p className="text-3xl font-bold text-gray-900">{rooms.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center py-4 text-sm font-bold transition ${
                  activeTab === tab.id ? 'bg-gray-50 text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className="mb-6 relative">
               <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase font-bold border-b">
                      <th className="pb-3 px-2">ID</th>
                      <th className="pb-3 px-2">Username</th>
                      <th className="pb-3 px-2">Role</th>
                      <th className="pb-3 px-2">Registered</th>
                      <th className="pb-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 px-2 text-sm text-gray-500">#{u.id}</td>
                        <td className="py-4 px-2 font-bold text-gray-900">{u.username}</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'landlord' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-2 text-right">
                          {u.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase font-bold border-b">
                      <th className="pb-3 px-2">Title</th>
                      <th className="pb-3 px-2">Owner</th>
                      <th className="pb-3 px-2">Price</th>
                      <th className="pb-3 px-2">Location</th>
                      <th className="pb-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rooms.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase())).map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 px-2 font-bold text-gray-900">{r.title}</td>
                        <td className="py-4 px-2 text-sm">{r.owner?.username}</td>
                        <td className="py-4 px-2 text-sm font-bold text-blue-600">${r.price}</td>
                        <td className="py-4 px-2 text-sm text-gray-500">{r.location}</td>
                        <td className="py-4 px-2 text-right">
                          <button onClick={() => handleDeleteRoom(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase font-bold border-b">
                      <th className="pb-3 px-2">Property</th>
                      <th className="pb-3 px-2">Tenant</th>
                      <th className="pb-3 px-2">Status</th>
                      <th className="pb-3 px-2">Dates</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.filter(b => b.room?.title.toLowerCase().includes(searchTerm.toLowerCase())).map(b => (
                      <tr key={b.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 px-2 font-bold text-gray-900">{b.room?.title}</td>
                        <td className="py-4 px-2 text-sm">{b.tenant?.username}</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-xs text-gray-500">
                          {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
