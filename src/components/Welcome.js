import React, { useState, useEffect } from 'react';
import ControlPanel from './Dashboard';
import { collection, getDocs, query, where, addDoc} from "../firestore";
import { db } from "../firestore";
import './Welcome.css';
import QrackLogo from "../svg/Qrack_logo.svg";
import Dashboard from './Dashboard';

const Welcome = ({ user }) => {
  const [username, setUsername] = useState('');
  const [showControlPanel, setShowControlPanel] = useState(false);

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((docSnapshot) => {
        setUsername(docSnapshot.data().username);
      });
      setShowControlPanel(true);
    }
  };

  const handleUsernameSubmit = async () => {
    if (username.trim()) {
      await addDoc(collection(db, "users"), {
        email: user.email,
        useruid: user.uid, // Agrega el useruid al documento
        username,
        Qrlist: [], // Agrega una lista vacía de Qrlist
      });
      setShowControlPanel(true);
    }
  };
  
  

  return (
    <div className="welcome-container">
      {!showControlPanel ? (
        <>
          <h3>
            <img src={QrackLogo} alt="Qrack Logo" style={{ width: "150px", height: "auto" }} />
          </h3>
          <h1>Bienvenido!</h1>
          <div className="username-input">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese un nombre de usuario"
            />
          </div>
          <button className='username-btn' onClick={handleUsernameSubmit}>Continuar</button>
        </>
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  );
};

export default Welcome;