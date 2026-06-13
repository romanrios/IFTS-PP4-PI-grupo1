import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import MichiCard from "../../components/MichiCard/MichiCard";
import MichiCardSkeleton from "../../components/MichiCardSkeleton/MichiCardSkeleton";
import TitleBar from "../../components/TitleBar/TitleBar";
import { useAuth } from "../../context/AuthContext";
import { errorAlert } from "../../utils/alerts";
import "./MichisPages.css";

function MichisPage() {
  const [michis, setMichis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMichis = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gatos", { params: { page, limit: 12 } });
      setMichis(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error al obtener los michis:", error);
      errorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMichis();
  }, [page]);

  const handleDeleteMichi = (id) => {
    setMichis((prev) => prev.filter((michi) => michi._id !== id));
  };

  return (


      <div className="michis-page">
        <TitleBar
          title={user?.isAdmin ? "Gestionar michis" : "Michis en adopción"}
          backTo={user?.isAdmin && "/admin"}
        />
        {user?.isAdmin && <button className="btn-add" onClick={() => navigate("/michis/nuevo")}>+ Agregar michi</button>}

        {loading ? (
          <div className="michis-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <MichiCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="michis-grid">
              {michis.map((michi) => (
                <MichiCard
                  key={michi._id}
                  michi={michi}
                  onDelete={handleDeleteMichi}
                />
              ))}
            </div>
            <div className="michis-pagination">
              <button
                type="button"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={pagination.page <= 1}
              >
                Anterior
              </button>
              <span className="michis-pagination__info">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>

  );
}

export default MichisPage;
