// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import QRRedirect from './components/QRRedirect/QRRedirect';
import PrivacyPolicy from './components/PrivacyPolicy';
import ExamplePage from './components/ExamplePage'; // Importar el nuevo componente
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="page">
          <Routes>
            <Route path="/qr/:token" element={<QRRedirect />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/example" element={<ExamplePage />} /> {/* Añadir la nueva ruta */}
            <Route path="*" element={<Auth />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
