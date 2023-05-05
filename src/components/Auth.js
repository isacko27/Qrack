import { Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import SignIn from './SingIn';
import SignUp from './SingUp';
import Welcome from './Welcome';
import QRRedirects from './QRRedirect';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Auth = () => {
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/qr/:id" element={<QRRedirects />} />
      <Route
        path="/"
        element={
          <TransitionGroup component={null}>
            <CSSTransition
              key={user ? 'user' : showSignUp ? 'signUp' : 'signIn'}
              timeout={300}
              classNames="page"
            >
              <div>
                {user ? (
                  <Welcome user={user} handleLogout={handleLogout} />
                ) : showSignUp ? (
                  <SignUp toggleSignUp={toggleSignUp} />
                ) : (
                  <SignIn toggleSignUp={toggleSignUp} />
                )}
              </div>
            </CSSTransition>
          </TransitionGroup>
        }
      />
    </Routes>
  );
};

export default Auth;