import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from "../firestore";
import { db } from "../firestore";
import { useNavigate } from 'react-router-dom';
import domtoimage from 'dom-to-image';
import { auth } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Welcome.css';

const Welcome = ({ user }) => {
  const [webRedirect, setWebRedirect] = useState('');
  const qrValue = `${window.location.protocol}//${window.location.host}/qr/${user.uid}`;
  const qrRef = useRef();

  const handleUrlChange = (event) => {
    setWebRedirect(event.target.value);
  };

  async function saveUserUrl(db, data) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userid", "==", data.userid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const docRef = await addDoc(usersRef, data);
        console.log("Documento creado con ID:", docRef.id);
        console.log("Enlace:", webRedirect);
      } else {
        querySnapshot.forEach(async (docSnapshot) => {
          const docRef = doc(db, "users", docSnapshot.id);
          await updateDoc(docRef, { url: data.url });
          console.log("Documento actualizado con ID:", docSnapshot.id);
          console.log("Enlace:", webRedirect);
        });
      }
    } catch (e) {
      console.error("Error al agregar o actualizar el documento:", e);
    }
  };

  const handleClick = () => {
    saveUserUrl(db, { userid: user.uid, url: webRedirect });
  };

  const downloadQRCodePng = () => {
    domtoimage.toPng(qrRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr-code.png';
        link.click();
      })
      .catch((error) => {
        console.error('Error al generar la imagen:', error);
      });
  };

  const downloadQRCodeSvg = () => {
    const svgElement = qrRef.current.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-code.svg';
    link.click();
  };
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
    <nav className="navbar">
      <div className="navbar-right">
        <button onClick={handleSignOut} className="logout-button">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </nav>
      <div className="welcome-container">
        <h1>Bienvenido, {user.email}!</h1>
        <div className="qr-code-container" ref={qrRef}>
          <QRCode value={qrValue} renderAs="svg" />
        </div>
        <div className="url-input-container">
          <input
            type="text"
            value={webRedirect}
            onChange={handleUrlChange}
            placeholder="Ingrese la URL de redirección"
          />
          <button onClick={handleClick}>Cambiar Direccion del QRCode</button>
        </div>
          <div className="download-buttons">
            <button
              className="download-button download-button-svg"
              onClick={downloadQRCodeSvg}
            >
              Descargar QRCode en SVG
            </button>
            <button
              className="download-button download-button-png"
              onClick={downloadQRCodePng}
            >
              Descargar QRCode en PNG
            </button>
        </div>
      </div>
    </>
  );
};

export default Welcome;