
import { useAuth } from "../../context/AuthContext";
import "./MichiCard.css";

function MichiCard({ michi }) {
  const { user } = useAuth();

  return (
    <article className="michi-card">
      <img
        src={michi.foto}
        alt={michi.nombre}
        className="michi-card__image"
      />

      <div className="michi-card__content">
        <h3>{michi.nombre}</h3>

        <p className="michi-card__info">
          {michi.sexo === "M" ? "♂" : "♀"} {michi.edadAprox}
        </p>

        <p className="michi-card__description">
          {michi.descripcion}
        </p>

        <div className="michi-card__actions">
          {user?.isAdmin ? (
            <>
              <button>👁</button>
              <button>✎</button>
              <button>🗑</button>
            </>
          ) : (
            <button className="btn-adoptar">Quiero adoptarlo</button>
          )}
        </div>
      </div>
    </article>
  );
}

export default MichiCard;