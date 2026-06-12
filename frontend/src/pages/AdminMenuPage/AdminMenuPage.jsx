import { Link } from "react-router-dom";
import TitleBar from "../../components/TitleBar/TitleBar";

function AdminMenuPage() {
  return (
    <div>
      <TitleBar title="Menú administrador" />

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
