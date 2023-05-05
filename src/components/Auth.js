import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import SignIn from "./SingIn";
import SignUp from "./SingUp";
import Welcome from "./Welcome";
import PasswordReset from "./PasswordReset";
import QRRedirects from "./QRRedirect";
import { CSSTransition, TransitionGroup } from "react-transition-group";

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

  return (
    <Routes>
      <Route path="/qr/:id" element={<QRRedirects />} />
      <Route path="/resetpassword" element={<PasswordReset />} />
      <Route
        path="/*"
        element={
          <TransitionGroup component={null}>
            <CSSTransition
              key={user ? "user" : showSignUp ? "signUp" : "signIn"}
              timeout={300}
              classNames="page"
            >
              <Routes>
                {user ? (
                  <Route index element={<Welcome user={user} />} />
                ) : showSignUp ? (
                  <Route index element={<SignUp toggleSignUp={toggleSignUp} />} />
                ) : (
                  <Route index element={<SignIn toggleSignUp={toggleSignUp} />} />
                )}
              </Routes>
            </CSSTransition>
          </TransitionGroup>
        }
      />
    </Routes>
  );
};

export default Auth;
