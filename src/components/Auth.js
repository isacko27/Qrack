import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { findAdminByUid} from "../firestore"; // Importa la función findAdminByUid
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Welcome from "./Welcome";
import PasswordReset from "./PasswordReset";
import QRRedirects from "./QRRedirect/QRRedirect";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Dashboard from "./Dashboard/Dashboard";
import DashboardAdmin from "./admin/DashboardAdmin"; // Importa el componente DashboardAdmin

const Auth = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // Nuevo estado para administrador
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const adminDoc = await findAdminByUid(user.uid);
        if (adminDoc) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
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
      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
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
                  isAdmin ? (
                    <Route index element={<Navigate to="/dashboard/admin" replace />} />
                  ) : (
                    <Route index element={<Welcome user={user} />} />
                  )
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
