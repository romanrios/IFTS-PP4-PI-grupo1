import { useAuth } from "../context/AuthContext";

function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Bienvenido {user.name}</p>

      <img
        src={user.picture}
        alt={user.name}
        width={50}
        referrerPolicy="no-referrer"
      />

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default UserProfile;