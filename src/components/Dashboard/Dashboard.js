import React, { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../Navbar/NavBar";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Spinner from "../LoadingScreen/Spinner";
import QRModal from "../QRModal/QRModal";
import {
  findQRByToken,
  findUserByUid,
  printFirestoreDataTree,
  removeTokenFromUserQRList
} from "../../firestore";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const [qrCodes, setQRCodes] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedQR, setSelectedQR] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [qrCodeToDelete, setQRCodeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openQRModal = (type, qr = null) => {
    setModalType(type);
    setSelectedQR(qr);
    setShowQRModal(true);
  };

  const openDeleteConfirmation = (qrCode) => {
    setQRCodeToDelete(qrCode);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDelete = async (qrCode) => {
    if (qrCode !== null) {
      setDeleting(true);
      await removeTokenFromUserQRList(uid, qrCode.token);
      loadQRCodes(); // Recarga la lista de códigos QR después de eliminar
      setDeleting(false);
    }
    setShowDeleteConfirmation(false);
  };
  

  const closeQRModal = () => {
    setShowQRModal(false);
  };

  const uid = user ? user.uid : null;

  const loadQRCodes = useCallback(async () => {
    setLoading(true);
    if (uid) {
      const userDoc = await findUserByUid(uid);
      if (userDoc && userDoc.exists) {
        const qrList = userDoc.data().Qrlist;
        console.log("qrList:", qrList); // Muestra la lista de tokens QR
        const qrCodeDocs = await Promise.all(
          qrList.map((token) => findQRByToken(token))
        );
        const qrCodesData = qrCodeDocs.map((doc) => doc.data());
        console.log("qrCodesData:", qrCodesData); // Muestra la colección de códigos QR
        setQRCodes(qrCodesData);
        setLoading(false);
      } else {
        console.error("User document not found");
      }
    }
  }, [uid]);

  useEffect(() => {
    loadQRCodes();
    printFirestoreDataTree();
  }, [uid, loadQRCodes]);
  

  return (
    <div className="dashboard">
      <Navbar />
      {loading && <Spinner /> && <LoadingScreen />}
      <article className={loading ? "qr-grid hidden" : "qr-grid"}>
        {qrCodes.map((qrCode, index) => {
          console.log(`QR data for QRBox ${index}:`, qrCode.value); // Agrega el console.log aquí
          return (
            <section key={index} className="QRCODE Box">
              <div className="Qrimage-container">
                <QRCodeSVG value={qrCode.value} />
              </div>
              <div className="Qrcode-information-container">
                <h3 className="QRCODE-name">{qrCode.Qrnombre}</h3>
                <p className="QRCODE-URL">{qrCode.url}</p>
                <div className="token-div">{qrCode.token}</div>
              </div>
              <div className="Edit-QR-BUTTON-container">
                <button
                  className="EditQR-button btn btn-primary"
                  onClick={() => openQRModal("edit", qrCode)}
                >
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => openDeleteConfirmation(qrCode)}>
  Eliminar
</button>
              </div>
            </section>
          );
        })}
        <section className="Qr-add-Button-container">
          <div className="Add-QR-BUTTON-container">
            <div className="buttonadd-qr" onClick={() => openQRModal("add")}>
              +
            </div>
          </div>
        </section>
      </article>
      {showQRModal && (
        <QRModal
          type={modalType}
          closeModal={closeQRModal}
          uid={uid}
          setQRCodes={setQRCodes} // Asegúrate de pasar setQRCodes aquí
          selectedQR={selectedQR}
        />
      )}
      {
  showDeleteConfirmation && (
    <div className="delete-confirmation-modal">
      <div className="modal-content">
        <h2>Eliminar QRCode</h2>
        <p>¿Estás seguro de que deseas eliminar este QRCode?</p>
        <button
  className="btn btn-danger"
  onClick={() => handleDelete(qrCodeToDelete)}
  disabled={deleting}
>
  {deleting ? "Eliminando..." : "Sí, eliminar"}
</button>
        <button className="btn btn-secondary" onClick={closeDeleteConfirmation}>
          Cancelar
        </button>
      </div>
    </div>
  )
}
    </div>
  );
  
      };

export default Dashboard