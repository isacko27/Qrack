import React, { useState } from 'react';
import { auth, signOut } from '../../firebaseConfig';
import QrackLogo from "../../svg/Qrack_logo_White.svg";
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faTimes, faQuestionCircle, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className={`navbar-container${menuOpen ? ' menu-open' : ''}`}>
        <div className="navbar-logo">
          <img src={QrackLogo} alt="Qrack Logo" style={{ width: "2.5em", height: "auto" }} />
        </div>
        <ul className="navbar-menu">
          <li className="navbar-menu-item">
            <button className="menu-button" onClick={toggleMenu}>
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>
          </li>
        </ul>
        <div className="menu">
          <ul className="menu-items">
            <li className="menu-item" onClick={handleSignOut}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión
            </li>
            <li className="menu-item">
              <FontAwesomeIcon icon={faQuestionCircle} /> Ayuda
            </li>
            <li className="menu-item">
              <FontAwesomeIcon icon={faAddressBook} /> Contactos
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
