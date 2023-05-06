import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import QRRedirect from './components/QRRedirect';
import PrivacyPolicy from './components/PrivacyPolicy';
import Dashboard from './components/Dashboard/Dashboard';
import { auth } from './firebaseConfig';

function App() {
  const [user, setUser] = useState(null);
  const [isUserExist, setIsUserExist] = useState(false);

  useEffect(() => {
    // Comprueba si el usuario ya ha iniciado sesión y actualiza el estado en consecuencia
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
      setIsUserExist(true);
    }

    // Escucha los cambios en la autenticación y actualiza el estado en consecuencia
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setIsUserExist(true);
      } else {
        setUser(null);
        localStorage.removeItem('user');
        setIsUserExist(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={isUserExist ? <Dashboard user={user} /> : <Navigate to="/" />}
          />
          <Route path="/qr/:id" element={<QRRedirect />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route
            path="/"
            element={
              isUserExist ? <Navigate to="/dashboard" /> : <Auth user={user} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
