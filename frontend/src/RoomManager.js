import React, { useEffect, useState } from 'react';
import './RoomManager.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function RoomManager() {
  const [rooms, setRooms] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [newRoom, setNewRoom] = useState({ id: '', name: '' });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch(`${API_URL}/room_sensor_id_map`);
    const data = await res.json();
    setRooms(data);
  };

  const handleChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setNewRoom({ id, name: rooms[id] });
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/rooms/${id}`, { method: 'DELETE' });
    fetchRooms();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${API_URL}/rooms/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoom.name })
      });
    } else {
      await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newRoom.id, name: newRoom.name })
      });
    }
    setEditingId(null);
    setNewRoom({ id: '', name: '' });
    fetchRooms();
  };

  return (
    <div className="room-manager">
      <h2>Room Manager</h2>
      <form onSubmit={handleSave} className="room-form">
        <input
          name="id"
          placeholder="ID"
          value={newRoom.id}
          onChange={handleChange}
          disabled={!!editingId}
          required
        />
        <input
          name="name"
          placeholder="Room Name"
          value={newRoom.name}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setNewRoom({ id: '', name: '' }); }}>Cancel</button>}
      </form>
      <ul className="room-list">
        {Object.entries(rooms).map(([id, name]) => (
          <li key={id}>
            <span>{id}: {name}</span>
            <button onClick={() => handleEdit(id)}>Edit</button>
            <button onClick={() => handleDelete(id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomManager;
