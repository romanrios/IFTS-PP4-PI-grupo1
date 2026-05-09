import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, user } = useAuth();

  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const loggedUser = await login(credentialResponse.credential);

      // redirección según rol
      if (loggedUser.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/michis");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ocultar si ya está logueado
  if (user) return null;

  return (
    <div>
      <h2>Login</h2>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}

export default Login;
