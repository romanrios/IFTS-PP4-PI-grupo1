import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import MichiDetailSkeleton from "../../components/MichiDetailSkeleton/MichiDetailSkeleton";
import TitleBar from "../../components/TitleBar/TitleBar";
import { useAuth } from "../../context/AuthContext";
import { errorAlert } from "../../utils/alerts";
import "./MichiDetailPage.css";

// const DEFAULT_TITLE = "MichiGestión";

const getEstadoClass = (estado) =>
  `michi-detail__estado--${estado.toLowerCase().replace(/\s+/g, "-")}`;

const formatSexo = (sexo) => (sexo === "M" ? "Macho ♂" : "Hembra ♀");

const formatFecha = (fecha) => {
  if (!fecha) return "No disponible";

  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function MichiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [michi, setMichi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchMichi();
  }, [id]);

  // useEffect(() => {
  //   if (michi?.nombre) {
  //     document.title = `${michi.nombre} | Adopta un Michi`;
  //   }

  //   return () => {
  //     document.title = DEFAULT_TITLE;
  //   };
  // }, [michi?.nombre]);

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
          <img
            src={michi.foto}
            alt={michi.nombre}
            className="michi-detail__image"
          />

          <div className="michi-detail__header">
            <h1>{michi.nombre}</h1>
            <span
              className={`michi-detail__estado ${getEstadoClass(michi.estadoAdopcion)}`}
            >
              {michi.estadoAdopcion}
            </span>
          </div>

          <div className="michi-detail__info">
            <div className="michi-detail__info-item">
              <span>Edad</span>
              <strong>{michi.edadAprox}</strong>
            </div>

            <div className="michi-detail__info-item">
              <span>Sexo</span>
              <strong>{formatSexo(michi.sexo)}</strong>
            </div>

            <div className="michi-detail__info-item">
              <span>Estado</span>
              <strong>{michi.estadoAdopcion}</strong>
            </div>

            <div className="michi-detail__info-item">
              <span>Fecha de publicación</span>
              <strong>{formatFecha(michi.createdAt)}</strong>
            </div>
          </div>

          <section className="michi-detail__description">
            <h2>Descripción</h2>
            <p>{michi.descripcion}</p>
          </section>

          <div className="michi-detail__actions">{renderAction()}</div>
        </article>
      ) : null}
    </div>
  );
}

export default MichiDetailPage;
