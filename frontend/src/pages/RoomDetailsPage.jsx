import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
      setRoom(response.data);
    };
    fetchRoom();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!token) {
        navigate('/tenant/login');
        return;
    }
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        roomId: id,
        startDate,
        endDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Booking request sent successfully!');
      setTimeout(() => navigate('/tenant/dashboard'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed');
    }
  };

  if (!room) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{room.title}</h2>
      <p className="text-gray-700 mb-4">{room.description}</p>
      <p className="text-xl font-bold mb-2">Price: ${room.price} / month</p>
      <p className="text-gray-600 mb-6">Location: {room.location}</p>

      {user?.role === 'tenant' && (
        <form onSubmit={handleBooking} className="bg-white p-6 rounded shadow border">
          <h3 className="text-xl font-bold mb-4">Book this room</h3>
          {message && <p className="mb-4 text-blue-500">{message}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Confirm Booking Request
          </button>
        </form>
      )}
    </div>
  );
};

export default RoomDetailsPage;
