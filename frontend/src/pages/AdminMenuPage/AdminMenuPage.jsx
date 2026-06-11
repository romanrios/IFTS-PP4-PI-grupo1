import { Link } from "react-router-dom";

function AdminMenuPage() {
  return (
    <div>
      <h1>Panel Administrador</h1>

      <Link to="/michis">
        <button>Gestionar Michis</button>
      </Link>

      <Link to="/adoptantes">
        <button>Ver Adoptantes</button>
      </Link>
    </div>
  );
}

export default AdminMenuPage;
