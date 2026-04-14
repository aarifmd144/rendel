import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

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
    if (window.confirm('Delete this user?')) {
      await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Delete this room?')) {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <div className="flex border-b mb-6">
        <button className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`px-4 py-2 ${activeTab === 'rooms' ? 'border-b-2 border-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('rooms')}>Rooms</button>
        <button className={`px-4 py-2 ${activeTab === 'bookings' ? 'border-b-2 border-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4">{u.username}</td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">
                    {u.role !== 'admin' && <button onClick={() => handleDeleteUser(u.id)} className="text-red-600">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Owner</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rooms.map(r => (
                <tr key={r.id}>
                  <td className="px-6 py-4">{r.title}</td>
                  <td className="px-6 py-4">{r.owner?.username}</td>
                  <td className="px-6 py-4">${r.price}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteRoom(r.id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Room</th>
                <th className="px-6 py-3 text-left">Tenant</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="px-6 py-4">{b.room?.title}</td>
                  <td className="px-6 py-4">{b.tenant?.username}</td>
                  <td className="px-6 py-4">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
