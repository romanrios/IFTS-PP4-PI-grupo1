import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api";
import TitleBar from "../../components/TitleBar/TitleBar";
import SolicitudCardSkeleton from "../../components/SolicitudCardSkeleton/SolicitudCardSkeleton";
import Spinner from "../../components/Spinner/Spinner";
import { confirmAlert, deleteConfirmAlert, errorAlert, successAlert } from "../../utils/alerts";
import "./SolicitudesPage.css";

function SolicitudesPage() {
  const [searchParams] = useSearchParams();
  const highlightedSolicitudId = searchParams.get("solicitud");
  const highlightedGatoId = searchParams.get("gato");

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [sortOrder, setSortOrder] = useState(-1);

  const getActionKey = (id, action) => `${id}-${action}`;

  const fetchSolicitudes = async () => {
    try {
      const params = {
        ...(searchText && { search: searchText }),
        ...(filterEstado && { estadoSolicitud: filterEstado }),
        ...(sortOrder !== -1 && { sort: sortOrder }),
      };
      
      const res = await api.get("/solicitudes", { params });
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
  }, [searchText, filterEstado, sortOrder]);

  useEffect(() => {
    if (!loading && highlightedSolicitudId) {
      const element = document.getElementById(`solicitud-${highlightedSolicitudId}`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [loading, highlightedSolicitudId, solicitudes]);

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

      <div className="solicitudes-filters">
        <input
          type="text"
          placeholder="Buscar por nombre de michi o adoptante..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="solicitudes-filters__search"
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="solicitudes-filters__select"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value))}
          className="solicitudes-filters__select"
        >
          <option value={-1}>Más recientes</option>
          <option value={1}>Más antiguos</option>
        </select>
      </div>

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
          {solicitudes.map((s) => {
            const gatoId = s.gato?._id ?? s.gato;
            const isHighlighted =
              s._id === highlightedSolicitudId ||
              (highlightedGatoId && gatoId === highlightedGatoId);
            const estadoKey = (s.estadoSolicitud || "").toLowerCase();
            const disabledByState = estadoKey === "eliminada";
            const disableAprobar = Boolean(actionLoading) || disabledByState || estadoKey === "aprobada";
            const disableRechazar = Boolean(actionLoading) || disabledByState || estadoKey === "rechazada";
            const disablePendiente = Boolean(actionLoading) || disabledByState || estadoKey === "pendiente";
            const disableEliminar = Boolean(actionLoading) || disabledByState;

            return (
            <article
              key={s._id}
              id={`solicitud-${s._id}`}
              className={`solicitud-card ${isHighlighted ? "solicitud-card--highlighted" : ""}`}
            >
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
                  disabled={disableAprobar}
                  title={disableAprobar ? (estadoKey === "aprobada" ? "Solicitud ya aprobada" : disabledByState ? "Solicitud eliminada" : "Acción en proceso") : "Aprobar solicitud"}
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
                  disabled={disableRechazar}
                  title={disableRechazar ? (estadoKey === "rechazada" ? "Solicitud ya rechazada" : disabledByState ? "Solicitud eliminada" : "Acción en proceso") : "Rechazar solicitud"}
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
                  disabled={disablePendiente}
                  title={disablePendiente ? (estadoKey === "pendiente" ? "Solicitud ya en pendiente" : disabledByState ? "Solicitud eliminada" : "Acción en proceso") : "Marcar como pendiente"}
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
                  disabled={disableEliminar}
                  title={disableEliminar ? (disabledByState ? "Solicitud eliminada" : "Acción en proceso") : "Eliminar solicitud"}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SolicitudesPage;
