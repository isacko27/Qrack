import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} TuMarca. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;