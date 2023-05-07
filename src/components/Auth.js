import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import SignIn from "./SingIn";
import SignUp from "./SingUp";
import Welcome from "./Welcome";
import PasswordReset from "./PasswordReset";
import QRRedirects from "./QRRedirect/QRRedirect";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Dashboard from "./Dashboard/Dashboard";

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
      <Route path="/qr/:value" element={<QRRedirects />} />
      <Route path="/resetpassword" element={<PasswordReset />} />
      <Route path="/dashboard/:uid" element={<Dashboard user={user} />} />
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
