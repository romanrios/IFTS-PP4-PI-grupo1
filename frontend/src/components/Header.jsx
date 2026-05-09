import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <h2>MichiGestión</h2>

      {user && (
        <div>
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
    </header>
  );
}

export default Header;