import { Link } from "react-router-dom";
import TitleBar from "../../components/TitleBar/TitleBar";
import "./AdminMenuPage.css";

function AdminMenuPage() {
  return (
    <div className="adminMenuPage">
      <TitleBar title="Menú administrador" />

      <div className="adminMenuPage__container">
        <Link to="/michis">
          <button className="adminMenuPage__btn">Gestionar Michis</button>
        </Link>

        <Link to="/adoptantes">
          <button className="adminMenuPage__btn">Ver Adoptantes</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminMenuPage;
