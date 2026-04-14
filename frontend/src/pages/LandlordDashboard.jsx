import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandlordDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRes = await axios.get('http://localhost:5000/api/rooms');
        // Filter rooms owned by this landlord (in a real app, the API should handle this)
        // For simplicity, we filter here, but we also fetch bookings which ARE filtered by backend.
        setRooms(roomsRes.data.filter(r => r.ownerId === JSON.parse(localStorage.getItem('user')).id));

        const bookingsRes = await axios.get('http://localhost:5000/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to fetch landlord data', err);
      }
    };
    fetchData();
  }, [token]);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
    } catch (err) {
      console.error('Failed to update booking status', err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(rooms.filter(r => r.id !== roomId));
      } catch (err) {
        console.error('Failed to delete room', err);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Landlord Dashboard</h2>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">My Rooms</h3>
          <button onClick={() => navigate('/landlord/rooms/new')} className="bg-green-500 text-white px-4 py-2 rounded">Add New Room</button>
        </div>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map(room => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{room.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${room.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => navigate(`/landlord/rooms/edit/${room.id}`)} className="text-blue-600 mr-4">Edit</button>
                    <button onClick={() => handleDeleteRoom(room.id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && <tr><td colSpan="4" className="px-6 py-4 text-center">No rooms listed</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Received Bookings</h3>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.room?.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.tenant?.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {booking.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="text-green-600 mr-4">Confirm</button>
                        <button onClick={() => handleUpdateStatus(booking.id, 'cancelled')} className="text-red-600">Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan="5" className="px-6 py-4 text-center">No bookings received</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
