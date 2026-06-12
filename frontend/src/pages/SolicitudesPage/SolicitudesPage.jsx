import { useEffect, useState } from "react";
import api from "../../api";
import TitleBar from "../../components/TitleBar/TitleBar";
import { confirmAlert, errorAlert, successAlert } from "../../utils/alerts";
import "./SolicitudesPage.css";

function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSolicitudes = async () => {
    try {
      const res = await api.get("/solicitudes");
      setSolicitudes(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const actualizarEstado = async (id, estadoSolicitud) => {
    try {
      await api.put(`/solicitudes/${id}`, {
        estadoSolicitud,
      });

      await successAlert("Solicitud " + estadoSolicitud);

      fetchSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarSolicitud = async (solicitud) => {
    const result = await confirmAlert(
      "Eliminar solicitud",
      `¿Desea eliminar la solicitud de ${solicitud.usuario?.name}?`,
    );

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/solicitudes/${solicitud._id}`);

      await successAlert(
        "Solicitud eliminada",
        "La solicitud fue eliminada correctamente",
      );

      fetchSolicitudes();
    } catch (error) {
      console.error(error);

      errorAlert("Error", "No se pudo eliminar la solicitud");
    }
  };

  return (
    <div className="solicitudes-page">
      <TitleBar title="Panel de Solicitudes" backTo="/admin" />

      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <p>No hay solicitudes registradas.</p>
      ) : (
        <div className="solicitudes-list">
          {solicitudes.map((s) => (
            <article key={s._id} className="solicitud-card">
              <div className="solicitud-card__header">
                <img src={s.gato?.foto} alt={s.gato?.nombre} />

                <div>
                  <h3>{s.gato?.nombre}</h3>

                  <p>
                    Solicitante:
                    <strong> {s.usuario?.name}</strong>
                  </p>

                  <p>{s.usuario?.email}</p>

                  <p className="solicitud-fecha">
                    {new Date(s.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              </div>

              <div className="solicitud-card__body">
                <p>
                  <strong>Teléfono:</strong> {s.telefonoContacto}
                </p>

                <div className="solicitud-card__estado">
                  <span
                    className={`estado-badge estado-${s.estadoSolicitud.toLowerCase()}`}
                  >
                    {s.estadoSolicitud}
                  </span>
                </div>

                <div className="solicitud-card__motivo">
                  <strong>Motivo</strong>
                  <p>{s.motivo}</p>
                </div>
              </div>

              <div className="solicitud-card__actions">
                <button
                  className="btn-aprobar"
                  onClick={() => actualizarEstado(s._id, "Aprobada")}
                >
                  Aprobar
                </button>

                <button
                  className="btn-rechazar"
                  onClick={() => actualizarEstado(s._id, "Rechazada")}
                >
                  Rechazar
                </button>

                <button
                  className="btn-pendiente"
                  onClick={() => actualizarEstado(s._id, "Pendiente")}
                >
                  Pendiente
                </button>

                <button
                  className="btn-eliminar-solicitud"
                  onClick={() => eliminarSolicitud(s)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default SolicitudesPage;
