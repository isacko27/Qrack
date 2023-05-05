import React from 'react';

const QREditorModal = ({ qrName, setQRName, qrUrl, setQRUrl, handleEditQR, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2>Editar código QR</h2>
        <label htmlFor="qrName">Nombre (opcional):</label>
        <input
          type="text"
          id="qrName"
          value={qrName}
          onChange={(e) => setQRName(e.target.value)}
        />
        <label htmlFor="qrUrl">URL (obligatoria):</label>
        <input
          type="text"
          id="qrUrl"
          value={qrUrl}
          onChange={(e) => setQRUrl(e.target.value)}
        />
        <button onClick={handleEditQR}>Editar</button>
        <button onClick={closeModal}>Salir</button>
      </div>
    </div>
  );
};

export default QREditorModal;
