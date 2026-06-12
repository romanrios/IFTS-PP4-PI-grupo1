import { Eye, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { confirmAlert, errorAlert, successAlert } from "../../utils/alerts";
import "./MichiCard.css";

function MichiCard({ michi }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const result = await confirmAlert(
      "Eliminar michi",
      `¿Desea eliminar a ${michi.nombre}?`,
    );

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/gatos/${michi._id}`);

      await successAlert(
        "Michi eliminado",
        `${michi.nombre} fue eliminado correctamente`,
      );

      window.location.reload();
    } catch (error) {
      console.error(error);

      errorAlert("Error", "No se pudo eliminar el michi");
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
              <button className="michi-card__btn-ver">
                <Eye />
              </button>
              <button
                className="michi-card__btn-editar"
                onClick={() => navigate(`/michis/editar/${michi._id}`)}
              >
                <Pencil />
              </button>
              <button
                className="michi-card__btn-eliminar"
                onClick={handleDelete}
              >
                <Trash />
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
