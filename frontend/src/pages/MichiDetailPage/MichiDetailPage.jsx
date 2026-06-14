import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import MichiDetailSkeleton from "../../components/MichiDetailSkeleton/MichiDetailSkeleton";
import MichiInfo, { formatFecha } from "../../components/MichiInfo/MichiInfo";
import TitleBar from "../../components/TitleBar/TitleBar";
import { useAuth } from "../../context/AuthContext";
import { errorAlert } from "../../utils/alerts";
import "./MichiDetailPage.css";

function MichiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [michi, setMichi] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchMichi();
  }, [id]);

  useEffect(() => {
    if (user?.isAdmin && michi) {
      fetchSolicitudes();
    }
  }, [user?.isAdmin, michi]);

  const fetchMichi = async () => {
    setLoading(true);
    setNotFound(false);
    setMichi(null);

    try {
      const res = await api.get(`/gatos/${id}`);
      setMichi(res.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        errorAlert("Error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSolicitudes = async () => {
    setLoadingSolicitudes(true);

    try {
      const res = await api.get(`/solicitudes/gato/${id}`);
      setSolicitudes(res.data);
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  const isAdopted = michi?.estadoAdopcion === "Adoptado";
  const isUnavailable = michi?.estadoAdopcion === "No publicado";
  const canRequestAdoption =
    michi && !isAdopted && !isUnavailable && !user?.isAdmin;

  const renderAction = () => {
    if (!user) {
      return (
        <button
          type="button"
          className="michi-detail__btn michi-detail__btn--primary"
          onClick={() => navigate("/login")}
        >
          Inicia sesión para adoptar
        </button>
      );
    }

    if (user.isAdmin) {
      return (
        <button
          type="button"
          className="michi-detail__btn michi-detail__btn--secondary"
          onClick={() => navigate(`/michis/editar/${id}`)}
        >
          Editar michi
        </button>
      );
    }

    if (canRequestAdoption) {
      return (
        <button
          type="button"
          className="michi-detail__btn michi-detail__btn--primary"
          onClick={() => navigate(`/adoptar/${id}`)}
        >
          Solicitar adopción
        </button>
      );
    }

    if (isAdopted) {
      return (
        <button
          type="button"
          className="michi-detail__btn michi-detail__btn--disabled"
          disabled
        >
          Adoptado
        </button>
      );
    }

    return (
      <button
        type="button"
        className="michi-detail__btn michi-detail__btn--disabled"
        disabled
      >
        No disponible
      </button>
    );
  };

  return (
    <div className="michi-detail-page">
      <TitleBar title="Detalle del michi" backTo="/michis" />

      {loading ? (
        <MichiDetailSkeleton />
      ) : notFound ? (
        <div className="michi-detail__not-found">
          <h2>Michi no encontrado</h2>
          <p>
            El michi que buscás no existe o fue eliminado del sistema.
          </p>
          <Link to="/michis" className="michi-detail__btn michi-detail__btn--primary">
            Volver al listado
          </Link>
        </div>
      ) : michi ? (
        <article className="michi-detail">
          <MichiInfo michi={michi} />

          {user?.isAdmin && (
            <section className="michi-detail__solicitudes">
              <h2>Solicitudes de adopción</h2>

              {loadingSolicitudes ? (
                <p className="michi-detail__solicitudes-empty">Cargando solicitudes...</p>
              ) : solicitudes.length === 0 ? (
                <p className="michi-detail__solicitudes-empty">
                  Este michi aún no tiene solicitudes.
                </p>
              ) : (
                <ul className="michi-detail__solicitudes-list">
                  {solicitudes.map((solicitud) => (
                    <li key={solicitud._id}>
                      <Link
                        to={`/solicitudes?solicitud=${solicitud._id}`}
                        className="michi-detail__solicitud-item"
                      >
                        <div className="michi-detail__solicitud-main">
                          <strong>{solicitud.usuario?.name ?? "Usuario sin nombre"}</strong>
                          <span
                            className={`michi-detail__solicitud-estado michi-detail__solicitud-estado--${solicitud.estadoSolicitud.toLowerCase()}`}
                          >
                            {solicitud.estadoSolicitud}
                          </span>
                        </div>
                        {solicitud.createdAt && (
                          <span className="michi-detail__solicitud-fecha">
                            {formatFecha(solicitud.createdAt)}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <div className="michi-detail__actions">{renderAction()}</div>
        </article>
      ) : null}
    </div>
  );
}

export default MichiDetailPage;
