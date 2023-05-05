import React, { useState, useRef } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence } from "@firebase/auth";
import { auth } from "../firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './forms.css'
import facebookLogo from "../images/facebook.png";
import googleLogo from "../images/google.png";
import PasswordReset from "./PasswordReset";
import QrackLogo from "../svg/Qrack_logo.svg";



const SignIn = ({ toggleSignUp }) => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [rememberMe, setRememberMe] = useState(false);
const [inputError, setInputError] = useState(false);

const handleRememberMeChange = async (e) => {
  try {
    if (e.target.checked) {
      await setPersistence(auth, browserLocalPersistence);
    } else {
      await setPersistence(auth, browserSessionPersistence);
    }
  } catch (error) {
    setError("Ocurrió un error al cambiar la persistencia de la sesión. Por favor, inténtalo de nuevo.");
  }
};



const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setInputError(true);
    setError("No puedes dejar esta casilla vacía");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    let errorMessage = "Ocurrió un error. Por favor, inténtalo de nuevo.";
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      errorMessage = "Correo electrónico o contraseña incorrecta";
      setInputError(true);
    }
    setError(errorMessage);
  }
};

const handleSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    setError("Ocurrió un error al iniciar sesión con Google. Por favor, inténtalo de nuevo.");
  }
};

const handleSignInWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    setError("Ocurrió un error al iniciar sesión con Facebook. Por favor, inténtalo de nuevo.");
  }
};


const [passwordVisible, setPasswordVisible] = useState(false);
const passwordRef = useRef(null);
const handleTogglePasswordVisibility = () => {
setPasswordVisible(!passwordVisible);
passwordRef.current.type = passwordRef.current.type === "password" ? "text" : "password";
};

const handleForgotPassword = async () => {
  if (!email) {
    setInputError(true);
    setError("No puedes dejar esta casilla vacía");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    setError("Se ha enviado un enlace de recuperación de contraseña a tu correo electrónico.");
  } catch (error) {
    setInputError(true);
    setError("Ocurrió un error al enviar el correo de recuperación");
  }
};


return (
<section className="ctn">
	<div className="auth-container">
  <h3>
  <img src={QrackLogo} alt="Qrack Logo" style={{ width: "150px", height: "auto" }} />
</h3>
		<section className="ctn-logins-grid">
    <div className="facebook-login-ctn" onClick={handleSignInWithFacebook}>
  <img src={facebookLogo} alt="Facebook" />
</div>
			<div className="google-login-ctn" onClick={handleSignInWithGoogle}>
  <img src={googleLogo} alt="Google" />
      </div>
		</section>

		<span className="or">or</span>
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
<div className={`ctn-form-password${inputError ? " input-error" : ""}`}>
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
{inputError && <p className="input-error-message">{error}</p>}
		<div className="remember-me-container">
			<div>
      <input
  id="rememberMe"
  type="checkbox"
  checked={rememberMe}
  onChange={handleRememberMeChange}
/>
				<label htmlFor="rememberMe">Recordarme</label>
			</div>
			<span onClick={handleForgotPassword} className="forgot-password-link">
			¿Olvidaste tu contraseña?
			</span>
		</div>
    <div className="submit-ctn">
    <button class="button-53" role="button">Aceptar</button>
    </div>
		</form>
		<p>
			¿No tienes una cuenta?{" "}
			<span onClick={toggleSignUp} className="signup-link">
			Regístrate
			</span>
		</p>
	</div>
</section>
);
};
export default SignIn;