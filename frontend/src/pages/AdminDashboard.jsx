import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Home, Calendar, Trash2, Search, Activity, ShieldCheck, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { token } = useAuth();
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
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'rooms', label: 'Properties', icon: <Home className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
             <div>
                <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  System Administration
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-3 tracking-tight">Platform Command</h1>
                <p className="text-slate-500 font-medium text-lg">Centralized oversight for users, listings, and rental operations.</p>
             </div>
             <div className="flex items-center gap-6 p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 ring-4 ring-rose-500/5">
                <div className="flex items-center gap-4 border-r border-slate-100 pr-6">
                   <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                     <Activity className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                     <p className="text-sm font-black text-emerald-500 uppercase tracking-widest leading-none">Healthy</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                     <Database className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">DB Sync</p>
                     <p className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Active</p>
                   </div>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           {[
             { label: 'Platform Users', value: users.length, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Listed Properties', value: rooms.length, color: 'text-rose-600', bg: 'bg-rose-50' },
             { label: 'Total Requests', value: bookings.length, color: 'text-emerald-600', bg: 'bg-emerald-50' }
           ].map(stat => (
             <div key={stat.label} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150`} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 relative z-10">{stat.label}</p>
                <p className={`text-5xl font-black ${stat.color} relative z-10 tracking-tight`}>{stat.value}</p>
             </div>
           ))}
        </div>

        {/* Interactive Management Section */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
          <div className="flex flex-col md:flex-row border-b border-slate-50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-8 text-sm font-black uppercase tracking-widest transition-all duration-300 relative ${
                  activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.icon} {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full translate-y-2 opacity-0 group-hover:opacity-100" />}
              </button>
            ))}
          </div>

          <div className="p-10 flex-1 flex flex-col">
            <div className="mb-10 relative">
               <input
                type="text"
                placeholder={`Search across ${activeTab}...`}
                className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-slate-100 focus:border-slate-300 outline-none transition-all duration-300 font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Search className="w-6 h-6 text-slate-300 absolute left-6 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex-1 overflow-x-auto">
              {activeTab === 'users' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50">
                      <th className="pb-6 px-4">Member Profile</th>
                      <th className="pb-6 px-4">Platform Role</th>
                      <th className="pb-6 px-4">Joined Platform</th>
                      <th className="pb-6 px-4 text-right">Administrative Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-8 px-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black uppercase shadow-lg shadow-slate-900/10">
                                {u.username.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-900">{u.username}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">ID: platform_{u.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="py-8 px-4">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                            u.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : u.role === 'landlord' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-8 px-4 text-xs font-bold text-slate-500 uppercase tracking-tight">{new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</td>
                        <td className="py-8 px-4 text-right">
                          {u.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u.id)} className="px-6 py-3 bg-white border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-rose-600/20 active:scale-95">
                              Deactivate Member
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
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50">
                      <th className="pb-6 px-4">Property Assets</th>
                      <th className="pb-6 px-4">Property Owner</th>
                      <th className="pb-6 px-4">Valuation</th>
                      <th className="pb-6 px-4">Property Location</th>
                      <th className="pb-6 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rooms.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase())).map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-8 px-4 font-black text-slate-900 group">{r.title}</td>
                        <td className="py-8 px-4">
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-600" />
                             <span className="text-xs font-black uppercase text-slate-600">{r.owner?.username}</span>
                           </div>
                        </td>
                        <td className="py-8 px-4 text-sm font-black text-blue-600">${r.price.toLocaleString()}</td>
                        <td className="py-8 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{r.location}</td>
                        <td className="py-8 px-4 text-right">
                          <button onClick={() => handleDeleteRoom(r.id)} className="p-4 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'bookings' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50">
                      <th className="pb-6 px-4">Rental Asset</th>
                      <th className="pb-6 px-4">Requesting Tenant</th>
                      <th className="pb-6 px-4">Contract Status</th>
                      <th className="pb-6 px-4">Rental Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings.filter(b => b.room?.title.toLowerCase().includes(searchTerm.toLowerCase())).map(b => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-8 px-4 font-black text-slate-900">{b.room?.title}</td>
                        <td className="py-8 px-4">
                           <div className="px-4 py-2 bg-slate-100 rounded-xl inline-block text-[10px] font-black uppercase text-slate-600 tracking-widest">
                             {b.tenant?.username}
                           </div>
                        </td>
                        <td className="py-8 px-4">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                            b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : b.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-8 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Empty States for Search */}
            {((activeTab === 'users' && users.length === 0) || (activeTab === 'rooms' && rooms.length === 0) || (activeTab === 'bookings' && bookings.length === 0)) && (
               <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
                     <Database className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">System Records Empty</h3>
                  <p className="text-slate-400 max-w-xs mx-auto font-medium">No active records found for {activeTab}. The platform is awaiting new activity.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
