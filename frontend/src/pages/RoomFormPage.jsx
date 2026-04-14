import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });

  useEffect(() => {
    if (id) {
      const fetchRoom = async () => {
        const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setFormData(response.data);
      };
      fetchRoom();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/rooms/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/rooms', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/landlord/dashboard');
    } catch (err) {
      console.error('Failed to save room', err);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">{id ? 'Edit Room' : 'Add New Room'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow border">
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price (per month)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {id ? 'Update Room' : 'Create Room'}
        </button>
      </form>
    </div>
  );
};

export default RoomFormPage;
