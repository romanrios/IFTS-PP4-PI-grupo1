import "./MichiInfo.css";

const getEstadoClass = (estado) =>
  `michi-info__estado--${estado.toLowerCase().replace(/\s+/g, "-")}`;

export const formatSexo = (sexo) => (sexo === "M" ? "Macho ♂" : "Hembra ♀");

export const formatFecha = (fecha) => {
  if (!fecha) return "No disponible";

  return new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function MichiInfo({ michi }) {
  return (
    <div className="michi-info">
      <img
        src={michi.foto}
        alt={michi.nombre}
        className="michi-info__image"
      />

      <div className="michi-info__header">
        <h1>{michi.nombre}</h1>
        <span
          className={`michi-info__estado ${getEstadoClass(michi.estadoAdopcion)}`}
        >
          {michi.estadoAdopcion}
        </span>
      </div>

      <div className="michi-info__meta">
        <div className="michi-info__meta-item">
          <span>Edad</span>
          <strong>{michi.edadAprox}</strong>
        </div>

        <div className="michi-info__meta-item">
          <span>Sexo</span>
          <strong>{formatSexo(michi.sexo)}</strong>
        </div>

        <div className="michi-info__meta-item">
          <span>Fecha de publicación</span>
          <strong>{formatFecha(michi.createdAt)}</strong>
        </div>
      </div>

      <section className="michi-info__description">
        <h2>Descripción</h2>
        <p>{michi.descripcion}</p>
      </section>
    </div>
  );
}

export default MichiInfo;
