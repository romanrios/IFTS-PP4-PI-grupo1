import { useEffect, useState } from "react";
import api from "../../api";
import TitleBar from "../../components/TitleBar/TitleBar";
import SolicitudCardSkeleton from "../../components/SolicitudCardSkeleton/SolicitudCardSkeleton";
import Spinner from "../../components/Spinner/Spinner";
import { confirmAlert, deleteConfirmAlert, errorAlert, successAlert } from "../../utils/alerts";
import "./SolicitudesPage.css";

function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const getActionKey = (id, action) => `${id}-${action}`;

  const fetchSolicitudes = async () => {
    try {
      const res = await api.get("/solicitudes");
      setSolicitudes(res.data);
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const actualizarEstado = async (solicitud, estadoSolicitud) => {
    const acciones = {
      Aprobada: "aprobar",
      Rechazada: "rechazar",
      Pendiente: "marcar como pendiente",
    };

    const titulos = {
      Aprobada: "Aprobar solicitud",
      Rechazada: "Rechazar solicitud",
      Pendiente: "Cambiar estado de solicitud",
    };

    const result = await confirmAlert(
      titulos[estadoSolicitud],
      `¿Desea ${acciones[estadoSolicitud]} la solicitud de ${solicitud.usuario?.name}?`,
    );

    if (!result.isConfirmed) return;

    const actionKey = getActionKey(solicitud._id, estadoSolicitud);

    setActionLoading(actionKey);

    try {
      await api.put(`/solicitudes/${solicitud._id}`, {
        estadoSolicitud,
      });

      await successAlert(
        "Operación realizada",
        `La solicitud fue marcada como ${estadoSolicitud}.`,
      );

      fetchSolicitudes();
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    } finally {
      setActionLoading(null);
    }
  };

  const eliminarSolicitud = async (solicitud) => {
    const result = await deleteConfirmAlert(
      "Eliminar solicitud",
      `¿Desea eliminar la solicitud de ${solicitud.usuario?.name}? Esta acción no se puede deshacer.`,
    );

    if (!result.isConfirmed) return;

    const actionKey = getActionKey(solicitud._id, "eliminar");

    setActionLoading(actionKey);

    try {
      await api.delete(`/solicitudes/${solicitud._id}`);

      await successAlert(
        "Solicitud eliminada",
        "La solicitud fue eliminada correctamente",
      );

      fetchSolicitudes();
    } catch (error) {
      console.error(error);

      errorAlert("Error", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="solicitudes-page">
      <TitleBar title="Panel de Solicitudes" backTo="/admin" />

      {loading ? (
        <div className="solicitudes-list">
          {Array.from({ length: 3 }).map((_, index) => (
            <SolicitudCardSkeleton key={index} />
          ))}
        </div>
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
                <div className="solicitud-card__meta">
                  <p>
                    <strong>Teléfono:</strong> {s.telefonoContacto}
                  </p>

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
                  disabled={Boolean(actionLoading)}
                  onClick={() => actualizarEstado(s, "Aprobada")}
                >
                  {actionLoading === getActionKey(s._id, "Aprobada") ? (
                    <Spinner />
                  ) : (
                    "Aprobar"
                  )}
                </button>

                <button
                  className="btn-rechazar"
                  disabled={Boolean(actionLoading)}
                  onClick={() => actualizarEstado(s, "Rechazada")}
                >
                  {actionLoading === getActionKey(s._id, "Rechazada") ? (
                    <Spinner />
                  ) : (
                    "Rechazar"
                  )}
                </button>

                <button
                  className="btn-pendiente"
                  disabled={Boolean(actionLoading)}
                  onClick={() => actualizarEstado(s, "Pendiente")}
                >
                  {actionLoading === getActionKey(s._id, "Pendiente") ? (
                    <Spinner />
                  ) : (
                    "Pendiente"
                  )}
                </button>

                <button
                  className="btn-eliminar-solicitud"
                  disabled={Boolean(actionLoading)}
                  onClick={() => eliminarSolicitud(s)}
                >
                  {actionLoading === getActionKey(s._id, "eliminar") ? (
                    <Spinner />
                  ) : (
                    "Eliminar"
                  )}
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
