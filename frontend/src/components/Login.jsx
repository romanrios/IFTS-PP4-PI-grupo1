import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner/Spinner";
import { errorAlert } from "../utils/alerts";
import "./Spinner/Spinner.css";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/michis");
      }
    }
  }, [user, navigate]);

  const handleSuccess = async (credentialResponse) => {
    setLoggingIn(true);

    try {
      await login(credentialResponse.credential);
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    } finally {
      setLoggingIn(false);
    }
  };

  // ocultar si ya está logueado
  if (user) return null;

  return (
    <div className="google-login">
      {loggingIn ? (
        <div className="login-loading" role="status" aria-label="Iniciando sesión">
          <Spinner size={28} />
          <span>Iniciando sesión...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() =>
            errorAlert("Error", "No se pudo iniciar sesión con Google")
          }
        />
      )}
    </div>
  );
}

export default Login;
