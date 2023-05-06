import { Route, Routes, useNavigate} from "react-router-dom";
import React, { useState, useEffect } from "react";
import PasswordReset from "./PasswordReset";
import SignIn from "./SingIn";
import SignUp from "./SingUp";
import Welcome from "./Welcome";
import { CSSTransition, TransitionGroup } from "react-transition-group";


const Auth = ({ user }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (user || isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={user ? "user" : showSignUp ? "signUp" : "signIn"}
        timeout={300}
        classNames="page"
      >
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Welcome user={user} />
              ) : showSignUp ? (
                <SignUp toggleSignUp={toggleSignUp} />
              ) : (
                <SignIn toggleSignUp={toggleSignUp} />
              )
            }
          />
          <Route path="/resetpassword" element={<PasswordReset />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Auth;