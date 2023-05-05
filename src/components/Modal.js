// Modal.js
import React, { useState, useEffect } from 'react';
import { updateQrCode, getQrCodeData } from '../firestore';

const Modal = ({ user, type, selectedToken, onAddToken, onClose }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    if (type === 'edit' && selectedToken) {
      fetchQrData(selectedToken);
    }
  }, [selectedToken, type]);

  const fetchQrData = async (token) => {
    const qrData = await getQrCodeData(token);

    setName(qrData.Qrnombre);
    setUrl(qrData.url);
  };

  const handleAddQrCode = async () => {
    if (token) {
      onAddToken(token);
    }
  };

  const handleEditQrCode = async () => {
    if (url) {
      await updateQrCode(selectedToken, name, url);
      onClose();
    } else {
      alert('La URL es obligatoria.');
    }
  };

  const handleSubmit = () => {
    if (type === 'add') {
      handleAddQrCode();
    } else if (type === 'edit') {
      handleEditQrCode();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {type === 'add' && (
          <>
            <h2>Agregar código QR</h2>
            <div className="modal-input">
              <label htmlFor="token">Token:</label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Ingrese un token"
              />
            </div>
          </>
        )}
        {type === 'edit' && (
          <>
            <h2>Editar código QR</h2>
            <div className="modal-input">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingrese un nombre (opcional)"
              />
            </div>
          </>
        )}
        <div className="modal-input">
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ingrese una URL"
          />
        </div>
        <div className="modal-buttons">
          <button className="modal-button" onClick={onClose}>Salir</button>
          <button className="modal-button" onClick={handleSubmit}>{type === 'add' ? 'Agregar' : 'Editar'}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

