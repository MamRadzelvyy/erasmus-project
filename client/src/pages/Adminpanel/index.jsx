import React, { useState, useEffect } from 'react';
import './index.css';

function AdminPanel() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    if (videoFile) formData.append('video', videoFile);

    if (editId) {
      fetch(`http://localhost:5000/api/companies/${editId}`, {
        method: 'PUT',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          setCompanies(prev => prev.map(c => (c.id === editId ? data.company : c)));
          resetForm();
          setMessage('La empresa ha sido actualizada.');
        })
        .catch(() => setMessage('Error al actualizar la empresa.'));
    } else {
      fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          setCompanies(prev => [...prev, data.company]);
          resetForm();
          setMessage('La empresa ha sido agregada.');
        })
        .catch(() => setMessage('Error al agregar la empresa.'));
    }
  };

  const handleEdit = (company) => {
    setName(company.name);
    setEditId(company.id);
    setVideoFile(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Realmente deseas eliminar esta empresa?')) return;

    fetch(`http://localhost:5000/api/companies/${id}`, { method: 'DELETE' })
      .then(() => {
        setCompanies(prev => prev.filter(c => c.id !== id));
        setMessage('La empresa ha sido eliminada.');
        if (editId === id) resetForm();
      });
  };

  const resetForm = () => {
    setName('');
    setVideoFile(null);
    document.querySelector('input[type=file]').value = '';
    setEditId(null);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-container">
      <div className="form-section">
        <h2>{editId ? 'Editar empresa' : 'Agregar empresa'}</h2>
        <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
          <label>Nombre de la empresa:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ingresa el nombre de la empresa"
          />

          <label>Archivo de video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            {...(!editId && { required: true })}
          />

          <button type="submit">{editId ? 'Guardar cambios' : 'Agregar empresa'}</button>
          {editId && <button type="button" onClick={resetForm} className="cancel-btn">Cancelar</button>}
          {message && <p className="success-msg">{message}</p>}
        </form>
      </div>

      <div className="list-section">
        <h3>Listado de empresas</h3>
        <ul>
          {companies.map((company) => (
            <li key={company.id}>
              <strong>{company.name}</strong><br />
              <video src={`http://localhost:5000${company.videoUrl}`} controls width="220" /><br />
              <button onClick={() => handleEdit(company)} className="edit-btn">Editar</button>
              <button onClick={() => handleDelete(company.id)} className="delete-btn">Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;