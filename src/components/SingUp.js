import React, { useState } from "react";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import QRCode from "react-qr-code";

const SignUp = ({ toggleSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setQrCodeValue(user.uid);
    } catch (error) {
      console.error(error.message);
      setError("Ocurrió un error al crear la cuenta");
    }
  };
  return (
    <div className="auth-container">
      {qrCodeValue ? (
        <div>
          <h1>Código QR</h1>
          <QRCode value={qrCodeValue} size={256} />
          <p>Escanea el código QR para acceder a tu perfil</p>
        </div>
      ) : (
        <div>
          <h1>Registrarse</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo electrónico:</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Contraseña:</label>
            <div className="ctn-form-password">
              <div className="password-icon-ctn">
                <i className="fas fa-lock"></i>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-password"
              />
              <div className="eye-icon-ctn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
              </div>
            </div>
            <label htmlFor="confirmPassword">Confirmar contraseña:</label>
            <div className="ctn-form-password">
              <div className="password-icon-ctn">
                <i className="fas fa-lock"></i>
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-password"
              />
              <div className="eye-icon-ctn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="button-53">
              Registrarse
            </button>
          </form>
          <p>
            ¿Ya tienes una cuenta?{" "}
            <span onClick={toggleSignUp} className="signup-link">
              Iniciar sesión
            </span>
          </p>
        </div>
      )}
    </div>
  );
  
};

export default SignUp;