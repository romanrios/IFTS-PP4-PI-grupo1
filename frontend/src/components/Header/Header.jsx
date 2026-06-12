import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
      <h2>MichiGestión</h2>

      {user && (
        <div className="header__user">
          <img
            src={user.picture}
            alt={user.name}
            width={40}
            referrerPolicy="no-referrer"
          />

          <button onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      )}
      </div>
    </header>
  );
}

export default Header;