import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import Spinner from "../LoadingScreen/Spinner";
import { findQRByToken} from "../../firestore";
import './QRRedirect.css';

const QRRedirect = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const redirect = async () => {
      const qrDoc = await findQRByToken(token);
      setLoading(false);
      if (qrDoc) {
        const url = qrDoc.data().url;
        if (isValidUrl(url)) {
          window.location.replace(url);
        } else {
          window.location.replace(`https://${url}`);
          setErrorMsg(`Esta URL no es válida. Contacte al dueño`);
        }
      } else {
        console.error("QR not found");
        setErrorMsg(`Este codigo QR no existe para crear el tuyo contactanos`);
      }
    };
    
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    };
    
    redirect();
  }, [token]);

  return (
    <div className="spinner-ctn">
      {loading && (
        <div className="spinner1">
          <Spinner />
        </div>
      )}
      {errorMsg ? (
        <div className="error">
          <FaTimesCircle size={50} color="red"/>
          <p>{errorMsg}</p>
        </div>
      ) : (
        <p>Redireccionando...</p>
      )}
    </div>
  );
};

export default QRRedirect;
