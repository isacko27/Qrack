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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
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
          <p>
            Escanea el código QR para acceder a tu perfil
          </p>
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
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">Confirmar contraseña:</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Registrarse</button>
          </form>
          <p>
            ¿Ya tienes una cuenta?{" "}
            <span onClick={toggleSignUp} className="signin-link">
              Iniciar sesión
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;