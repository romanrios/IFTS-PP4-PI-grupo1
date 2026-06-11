import { GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

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
    try {
      await login(credentialResponse.credential);
    } catch (error) {
      console.log(error);
    }
  };

  // ocultar si ya está logueado
  if (user) return null;

  return (
    <div className="google-login">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}

export default Login;
