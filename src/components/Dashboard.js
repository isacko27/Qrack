// Dashboard.js

import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import QRCode from 'qrcode.react';
import { findQRByToken, findUserByUid, addTokenToUserQRList, updateQRUrl, updateQRName } from '../firestore';
import './Dashboard.css';
import QRAddModal from './QRAddModal';
import QREditorModal from './QREditorModal';

const Dashboard = ({ user }) => {
  const [userQRs, setUserQRs] = useState([]);
  const [isAddQRModalVisible, setIsAddQRModalVisible] = useState(false);
  const [isEditQRModalVisible, setIsEditQRModalVisible] = useState(false);
  const [currentToken, setCurrentToken] = useState("");
  const [qrName, setQRName] = useState("");
  const [qrUrl, setQRUrl] = useState("");
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    loadUserQRs();
  }, [user]);

  const loadUserQRs = async () => {
    const userDoc = await findUserByUid(user.uid);

    if (userDoc) {
      const qrList = userDoc.data().Qrlist;
      const qrData = [];

      for (const token of qrList) {
        const qrDoc = await findQRByToken(token);
        if (qrDoc) {
          qrData.push(qrDoc.data());
        }
      }

      setUserQRs(qrData);
    }
  };

  const openAddQRModal = () => {
    setModalContent("add");
  };

  const openEditQRModal = (token) => {
    setCurrentToken(token);
    setModalContent("edit");
  };

  const closeModal = () => {
    setModalContent("");
    setCurrentToken("");
    setQRName("");
    setQRUrl("");
  };

  const handleAddQR = async () => {
    const qrDoc = await findQRByToken(currentToken);

    if (qrDoc) {
      const userDoc = await findUserByUid(user.uid);
      const qrList = userDoc.data().Qrlist;

      if (qrList.includes(currentToken)) {
        alert('Ya tienes este código QR.');
      } else {
        await addTokenToUserQRList(user.uid, currentToken);
        await loadUserQRs();
        setIsAddQRModalVisible(false);
        openEditQRModal(currentToken);
      }
    } else {
      alert('Token no encontrado.');
    }
  };

  const handleEditQR = async () => {
    if (qrUrl.trim()) {
      await updateQRUrl(currentToken, qrUrl);

      if (qrName.trim()) {
        await updateQRName(currentToken, qrName);
      }

      await loadUserQRs();
      closeModal();
    } else {
      alert("La URL es obligatoria.");
    }
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="dashboard-container">
      {/* (other JSX elements) */}

      {isAddQRModalVisible && (
        <QRAddModal
          currentToken={currentToken}
          setCurrentToken={setCurrentToken}
          handleAddQR={handleAddQR}
          closeModal={closeModal}
        />
      )}

      {isEditQRModalVisible && (
        <QREditorModal
          qrName={qrName}
          setQRName={setQRName}
          qrUrl={qrUrl}
          setQRUrl={setQRUrl}
          handleEditQR={handleEditQR}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Dashboard;