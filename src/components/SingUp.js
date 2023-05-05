import React, { useState, useRef } from "react";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './forms.css'
import facebookLogo from "../images/facebook.png";
import googleLogo from "../images/google.png";
import QrackLogo from "../svg/Qrack_logo.svg";

const SignUp = ({ toggleSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordRef = useRef(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
  
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
  
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        
      if (signInMethods.length > 0) {
        setError("El correo electrónico ya está en uso");
        return;
      }
  
      await createUserWithEmailAndPassword(auth, email, password);

    } catch (error) {
      console.error(error.message);
      setError("Ocurrió un error al crear la cuenta");
    }
  };
  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    passwordRef.current.type = passwordRef.current.type === "password" ? "text" : "password";
  }

  return (
    <section className="ctn">
      <div className="auth-container">
      <div className="centered-container">
        <h3>
          <img src={QrackLogo} alt="Qrack Logo" style={{ width: "150px", height: "auto" }} />
        </h3>
        <h2 className="title">Registrarse</h2>
      </div>
        <section className="ctn-logins-grid">
          <div className="facebook-login-ctn">
            <img src={facebookLogo} alt="Facebook" />
          </div>
          <div className="google-login-ctn">
            <img src={googleLogo} alt="Google" />
          </div>
        </section>

        <span className="or">or</span>
        <form onSubmit={handleSubmit}>
        <div className={`ctn-form-email${error ? " input-error" : ""}`}>
            <div className="email-icon-ctn">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              className="form-email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={`ctn-form-password${error ? " input-error" : ""}`}>
            <div className="lock-icon-ctn">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div className="eye-icon-ctn" onClick={handleTogglePasswordVisibility}>
              {passwordVisible ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </div>
            <input
              className="form-password"
              ref={passwordRef}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={`ctn-form-password${error ? " input-error" : ""}`}>
            <div className="lock-icon-ctn">
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div className="eye-icon-ctn" onClick={handleTogglePasswordVisibility}>
              {passwordVisible ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
                )}
              </div>
              <input
                className="form-password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="input-error-message">{error}</p>}
            <div className="submit-ctn">
              <button className="button-53">Registrarse</button>
            </div>
          </form>
          <p>
            ¿Ya tienes una cuenta?{" "}
            <span onClick={toggleSignUp} className="signup-link">
              Iniciar sesión
            </span>
          </p>
        </div>
      </section>
    );
  };

export default SignUp;