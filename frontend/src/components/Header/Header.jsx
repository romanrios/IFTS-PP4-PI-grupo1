import { useAuth } from "../../context/AuthContext";
import { confirmAlert } from "../../utils/alerts";
import "./Header.css";

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const result = await confirmAlert(
      "Cerrar sesión",
      "¿Está seguro que desea cerrar sesión?"
    );

    if (!result.isConfirmed) return;

    logout();
  };

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

            <button onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;