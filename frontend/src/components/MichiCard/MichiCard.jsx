import { Eye, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Spinner from "../Spinner/Spinner";
import { useAuth } from "../../context/AuthContext";
import { deleteConfirmAlert, errorAlert, successAlert, confirmAlert } from "../../utils/alerts";
import "./MichiCard.css";

function MichiCard({ michi, onDelete, onCancelSolicitud, solicitudResumen, miSolicitud }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const getEstadoClass = (estado) =>
    `michi-card__estado--${estado.toLowerCase().replace(/\s+/g, "-")}`;

  const isAdopted = michi.estadoAdopcion === "Adoptado";

  const renderAdoptanteAction = () => {
    if (isAdopted) {
      return (
        <span className="michi-card__adoptado" aria-disabled="true">
          Adoptado
        </span>
      );
    }

    if (miSolicitud?.estadoSolicitud === "Pendiente") {
      return (
        <div className="michi-card__solicitud-actions">
          <button
            type="button"
            className="michi-card__btn-editar-solicitud"
            disabled={canceling}
            onClick={() => navigate(`/adoptar/${michi._id}`)}
          >
            Editar solicitud
          </button>
          <button
            type="button"
            className="michi-card__btn-cancelar-solicitud"
            disabled={canceling}
            onClick={handleCancelSolicitud}
          >
            {canceling ? <Spinner /> : "Cancelar solicitud"}
          </button>
        </div>
      );
    }

    if (miSolicitud?.estadoSolicitud === "Aprobada") {
      return (
        <span className="michi-card__solicitud-aprobada" aria-disabled="true">
          Solicitud aprobada
        </span>
      );
    }

    if (miSolicitud?.estadoSolicitud === "Rechazada") {
      return (
        <span className="michi-card__solicitud-rechazada" aria-disabled="true">
          Solicitud rechazada
        </span>
      );
    }

    return (
      <button
        className="michi-card__btn-adoptar"
        onClick={() => navigate(`/adoptar/${michi._id}`)}
      >
        Quiero adoptarlo
      </button>
    );
  };

  const handleCancelSolicitud = async () => {
    const result = await confirmAlert(
      "Cancelar solicitud",
      "¿Deseas cancelar esta solicitud de adopción?",
      { confirmButtonText: "Sí, cancelar" },
    );

    if (!result.isConfirmed) return;

    setCanceling(true);

    try {
      await api.delete(`/solicitudes/${miSolicitud._id}/mi`);

      await successAlert(
        "Solicitud cancelada",
        "Tu solicitud fue eliminada correctamente.",
      );

      onCancelSolicitud?.(michi._id);
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    } finally {
      setCanceling(false);
    }
  };

  const handleDelete = async () => {
    const result = await deleteConfirmAlert(
      "Eliminar michi",
      `¿Desea eliminar a ${michi.nombre}? Esta acción no se puede deshacer.`,
    );

    if (!result.isConfirmed) return;

    setDeleting(true);

    try {
      await api.delete(`/gatos/${michi._id}`);

      await successAlert(
        "Michi eliminado",
        `${michi.nombre} fue eliminado correctamente`,
      );

      onDelete?.(michi._id);
    } catch (error) {
      console.error(error);

      errorAlert("Error", error);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <article className="michi-card">
      <img src={michi.foto} alt={michi.nombre} className="michi-card__image" />

      <div className="michi-card__content">
        <div className="michi-card__header">
          <h3>{michi.nombre}</h3>
          {user?.isAdmin && (
            <span
              className={`michi-card__estado ${getEstadoClass(michi.estadoAdopcion)}`}
            >
              {michi.estadoAdopcion}
            </span>
          )}
        </div>

        <p className="michi-card__info">
          {michi.sexo === "M" ? "♂" : "♀"} {michi.edadAprox}
        </p>

        <p className="michi-card__description">{michi.descripcion}</p>

        {user?.isAdmin && solicitudResumen && (
          <div className="michi-card__solicitudes">
            <span>Pendientes: {solicitudResumen.pendientes}</span>
            <span>Aprobadas: {solicitudResumen.aprobadas}</span>
            <span>Rechazadas: {solicitudResumen.rechazadas}</span>
          </div>
        )}

        <div className="michi-card__actions">
          {user?.isAdmin ? (
            <>
              <button
                className="michi-card__btn-ver"
                disabled={deleting}
                onClick={() => navigate(`/michis/${michi._id}`)}
                aria-label={`Ver ${michi.nombre}`}
              >
                <Eye />
              </button>
              <button
                className="michi-card__btn-editar"
                disabled={deleting}
                onClick={() => navigate(`/michis/editar/${michi._id}`)}
              >
                <Pencil />
              </button>
              <button
                className="michi-card__btn-eliminar"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? <Spinner /> : <Trash />}
              </button>
            </>
          ) : (
            renderAdoptanteAction()
          )}
        </div>
      </div>
    </article>
  );
}

export default MichiCard;
