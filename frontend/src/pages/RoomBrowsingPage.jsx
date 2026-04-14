import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RoomBrowsingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setRooms(response.data);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.title.toLowerCase().includes(search.toLowerCase()) ||
    room.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Browse Rooms</h2>
      <input
        type="text"
        placeholder="Search by title or location..."
        className="w-full p-2 border rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-white p-4 rounded shadow border">
            <h3 className="text-xl font-bold">{room.title}</h3>
            <p className="text-gray-600">{room.location}</p>
            <p className="text-blue-500 font-bold mt-2">${room.price} / month</p>
            <button
              onClick={() => navigate(`/rooms/${room.id}`)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomBrowsingPage;
