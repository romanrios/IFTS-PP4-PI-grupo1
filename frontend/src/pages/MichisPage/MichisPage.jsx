import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import MichiCard from "../../components/MichiCard/MichiCard";
import TitleBar from "../../components/TitleBar/TitleBar";
import { useAuth } from "../../context/AuthContext";
import "./MichisPages.css";

function MichisPage() {
  const [michis, setMichis] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMichis = async () => {
    try {
      const res = await api.get("/gatos");
      setMichis(res.data);
    } catch (error) {
      console.error("Error al obtener los michis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMichis();
  }, []);

  return (


      <div className="michis-page">
        <TitleBar
          title={user?.isAdmin ? "Gestionar michis" : "Michis en adopción"}
          backTo={user?.isAdmin && "/admin"}
        />
        {user?.isAdmin && <button className="btn-add" onClick={() => navigate("/michis/nuevo")}>+ Agregar michi</button>}

        {loading ? (
          <p>Cargando michis...</p>
        ) : (
          <div className="michis-grid">
            {michis.map((michi) => (
              <MichiCard key={michi._id} michi={michi} />
            ))}
          </div>
        )}
      </div>

  );
}

export default MichisPage;
