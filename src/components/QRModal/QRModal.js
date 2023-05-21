import React, { useState, useEffect } from 'react';
import {
  findUserByUid,
  findQRByToken,
  updateQRUrl,
  updateQRName,
  addTokenToUserQRList,
} from "../../firestore";
import './QRModal.css';

const QRModal = ({
  type,
  closeModal,
  uid,
  setQRCodes, // Asegúrate de que setQRCodes se esté utilizando aquí
  selectedQR,
}) => {
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');
  const [qrName, setQRName] = useState('');
  const [qrUrl, setQRUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');


  const handleTokenSubmit = async () => {
    setError(''); // Limpia el mensaje de error
    setLoading(true);
    const qrCodeDoc = await findQRByToken(token);
    setLoading(false);

    if (qrCodeDoc) {
      const qrCodeData = qrCodeDoc.data();
      setStep(2);
      setQRName(qrCodeData.Qrnombre);
      setQRUrl(qrCodeData.url);
    } else {
      setError('No se encontró el código QR con el token ingresado.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (step === 1) {
        handleTokenSubmit();
      } else if (step === 2) {
        handleFinalSubmit();
      }
    }
  }

  const handleFinalSubmit = async () => {
    if (type === "add") {
      const userDoc = await findUserByUid(uid);
      if (userDoc && userDoc.exists) {
        const userQRList = userDoc.data().Qrlist;
        if (userQRList.includes(token)) {
          setError("Ya estás usando este código QR.");
          return;
        }
      }
    }
    setError("");
    setUpdating(true);
  
    await updateQRUrl(token, qrUrl);
    if (qrName !== "") {
      await updateQRName(token, qrName);
    }
  
    if (type === "add") {
      await addTokenToUserQRList(uid, token);
      const newQRCode = { token: token, Qrnombre: qrName, url: qrUrl };
      setQRCodes((prevQRCodes) => [...prevQRCodes, newQRCode]);
    } else if (type === "edit") {
      const updatedQRCode = { token: token, Qrnombre: qrName, url: qrUrl };
      setQRCodes((prevQRCodes) =>
        prevQRCodes.map((qrCode) =>
          qrCode.token === token ? updatedQRCode : qrCode
        )
      );
    }
  
    setUpdating(false);
    closeModal();
  };

  useEffect(() => {
    if (selectedQR) {
      setToken(selectedQR.token);
      setQRName(selectedQR.Qrnombre);
      setQRUrl(selectedQR.url);
    }
  }, [selectedQR]);

  return (
    <div className="qr-modal qr-modal-transition">
      <div className="qr-modal-content">
        {step === 1 && (
          <>
            <h2>Ingrese el Token</h2>
            <form onKeyDown={handleKeyDown}>
              <div className="form-group">
                <label htmlFor="token">Token</label>
                <input
                  type="text"
                  className="form-control"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
              {loading && <p>Buscando código QR...</p>}
              {error && <p className="text-danger">{error}</p>}
              <button type="button" className="btn btn-primary" onClick={handleTokenSubmit} >
                Aceptar
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Editar Código QR</h2>
            <form onKeyDown={handleKeyDown}>
              <div className="form-group">
                <label htmlFor="qr-name">Nombre (opcional)</label>
                <input
                  type="text"
                  className="form-control"
                  id="qr-name"
                  value={qrName}
                  onChange={(e) => setQRName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="qr-url">URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="qr-url"
                  value={qrUrl}
                  onChange={(e) => setQRUrl(e.target.value)}
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinalSubmit}
                disabled={updating}
              >
                {updating ? 'Actualizando código QR...' : 'Actualizar'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default QRModal;
