import Login from "../../components/Login";
import "./LoginPage.css";
import isotype from "../../assets//isotype-white.svg";

function LoginPage() {
  return (
    <div className="login-page">
      <img src={isotype} alt="Isotype" />
      <h1>MichiGestión</h1>
      <Login />
    </div>
  );
}

export default LoginPage;
