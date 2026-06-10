import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import MichiCard from "../components/MichiCard/MichiCard";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/michisPages.css";

function MichisPage() {
  const [michis, setMichis] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

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
    <>
      <div className="michis-page">
        <h1>{user?.isAdmin ? "Gestionar michis" : "Michis en adopción"}</h1>


        {user?.isAdmin && (
            <button className="btn-add">+ Agregar michi</button>
          )}

        {loading ? (
          <p>Cargando michis...</p>
        ) : (
          <div className="michis-grid">
            {michis.map((michi) => (
              <MichiCard
                key={michi._id}
                michi={michi}
              />
            ))}
          </div>
        )}
      </div>
      
    </>
  );
}

export default MichisPage;