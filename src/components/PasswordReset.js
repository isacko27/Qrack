import React, { useState } from "react";
import { sendPasswordResetEmail } from "@firebase/auth";
import { auth } from "../firebaseConfig";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './forms.css';
import QrackLogo from "../svg/Qrack_logo.svg";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [inputError, setInputError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setInputError(true);
      setError("No puedes dejar esta casilla vacía");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
    } catch (error) {
      setError("Ocurrió un error al enviar el correo de restablecimiento de contraseña. Por favor, inténtalo de nuevo.");
      setInputError(true);
    }
  };

  return (
    <section className="ctn">
      <div className="auth-container">
      <div className="centered-container">
        <h3>
          <img src={QrackLogo} alt="Qrack Logo" style={{ width: "150px", height: "auto" }} />
        </h3>
        <h2 className="title">Restablecer contraseña</h2>
      </div>
        {emailSent ? (
          <div>
            <p>Se ha enviado un correo electrónico para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.</p>
            <Link to="/" className="back-to-signin-link signup-link">Volver a Iniciar sesión</Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className={`ctn-form-email${inputError ? " input-error" : ""}`}>
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
              {inputError && <p className="input-error-message">{error}</p>}
              <div className="submit-ctn">
                <button className="button-53">Enviar</button>
              </div>
            </form>
            <p>
              ¿Recuerdas tu contraseña?{" "}
              <Link to="/" className="back-to-signin-link signup-link">
                Volver a Iniciar sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default PasswordReset;
