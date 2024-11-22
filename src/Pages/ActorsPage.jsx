import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActorsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorName, setActorName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [actors, setActors] = useState([]);
  const [editingActorId, setEditingActorId] = useState(null);

  useEffect(() => {
    fetchActors();
  }, []);

  // Fetch actors from the backend
  const fetchActors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/actors');
      setActors(response.data);
    } catch (error) {
      console.error('Error fetching actors:', error);
    }
  };

  // Handle creating a new actor
  const handleCreateActor = () => {
    setEditingActorId(null);
    setActorName('');
    setDateOfBirth('');
    setIsModalOpen(true);
  };

  // Handle editing an existing actor
  const handleEditActor = (id, name, dob) => {
    setEditingActorId(id);
    setActorName(name);
    setDateOfBirth(dob);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActorName('');
    setDateOfBirth('');
    setEditingActorId(null);
  };

  // Handle submitting the form (either create or edit)
  const handleSubmit = async () => {
    if (actorName.trim() === '') {
      alert('Actor name is required!');
      return;
    }

    if (editingActorId) {
      // Update existing actor
      try {
        await axios.put(`http://localhost:5000/api/actors/${editingActorId}`, {
          actorName,
          dateOfBirth,
        });

        setActors(
          actors.map((actor) =>
            actor.ActorID === editingActorId
              ? { ...actor, ActorName: actorName, DateOfBirth: dateOfBirth }
              : actor
          )
        );
        handleCloseModal();
      } catch (error) {
        console.error('Error updating actor:', error);
      }
    } else {
      // Create a new actor
      try {
        const response = await axios.post('http://localhost:5000/api/actors/create', {
          actorName,
          dateOfBirth,
        });

        setActors([
          ...actors,
          { ActorID: response.data.actorId, ActorName: actorName, DateOfBirth: dateOfBirth },
        ]);
        handleCloseModal();
      } catch (error) {
        console.error('Error creating actor:', error);
      }
    }
  };

  // Handle deleting an actor
  const handleDeleteActor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/actors/${id}`);
      setActors(actors.filter((actor) => actor.ActorID !== id));
    } catch (error) {
      console.error('Error deleting actor:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Manage Actors</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>#</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actor Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Operation</th>
          </tr>
        </thead>
        <tbody>
          {actors.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                No actors available.
              </td>
            </tr>
          ) : (
            actors.map((actor, index) => (
              <tr key={actor.ActorID}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{actor.ActorName}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    style={{
                      backgroundColor: '#ffc107',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '5px',
                    }}
                    onClick={() => handleEditActor(actor.ActorID, actor.ActorName, actor.DateOfBirth)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteActor(actor.ActorID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add Actor Button - Positioned in the right-most corner */}
      <button
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleCreateActor}
      >
        + Create Actor
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              width: '300px',
              textAlign: 'center',
            }}
          >
            <h3>{editingActorId ? 'Edit Actor' : 'Add Actor'}</h3>
            <input
              type="text"
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              placeholder="Actor Name"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                color: '#333', // Darker font color
              }}
            />
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                color: '#333', // Darker font color
              }}
            />
            <br />
            <button
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
              onClick={handleSubmit}
            >
              {editingActorId ? 'Update Actor' : 'Add Actor'}
            </button>
            <button
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                marginLeft: '10px',
              }}
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorsPage;
