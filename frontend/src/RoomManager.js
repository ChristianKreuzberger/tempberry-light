import React, { useEffect, useState } from 'react';
import './RoomManager.css';
import { fetchRoomMapping, createRoom, updateRoom, deleteRoom } from './TempberryAPI';

function RoomManager() {
  const [rooms, setRooms] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [newRoom, setNewRoom] = useState({ id: '', name: '' });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const data = await fetchRoomMapping();
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
    await deleteRoom(id);
    loadRooms();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateRoom(editingId, newRoom.name);
    } else {
      await createRoom(newRoom.id, newRoom.name);
    }
    setEditingId(null);
    setNewRoom({ id: '', name: '' });
    loadRooms();
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
