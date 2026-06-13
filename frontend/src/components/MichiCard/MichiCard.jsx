import { Eye, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Spinner from "../Spinner/Spinner";
import { useAuth } from "../../context/AuthContext";
import { deleteConfirmAlert, errorAlert, successAlert } from "../../utils/alerts";
import "./MichiCard.css";

function MichiCard({ michi, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

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
        <h3>{michi.nombre}</h3>

        <p className="michi-card__info">
          {michi.sexo === "M" ? "♂" : "♀"} {michi.edadAprox}
        </p>

        <p className="michi-card__description">{michi.descripcion}</p>

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
            <button
              className="michi-card__btn-adoptar"
              onClick={() => navigate(`/adoptar/${michi._id}`)}
            >
              Quiero adoptarlo
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default MichiCard;
