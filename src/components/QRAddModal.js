import React from 'react';

const QRAddModal = ({ currentToken, setCurrentToken, handleAddQR, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2>Agregar código QR</h2>
        <label htmlFor="token">Token:</label>
        <input
          type="text"
          id="token"
          value={currentToken}
          onChange={(e) => setCurrentToken(e.target.value)}
        />
        <button onClick={handleAddQR}>Agregar</button>
        <button onClick={closeModal}>Salir</button>
      </div>
    </div>
  );
};

export default QRAddModal;