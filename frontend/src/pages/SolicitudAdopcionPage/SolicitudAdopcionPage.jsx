import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import MichiInfo from "../../components/MichiInfo/MichiInfo";
import SolicitudAdopcionSkeleton from "../../components/SolicitudAdopcionSkeleton/SolicitudAdopcionSkeleton";
import Spinner from "../../components/Spinner/Spinner";
import TitleBar from "../../components/TitleBar/TitleBar";
import {
    confirmAlert,
    errorAlert,
    successAlert,
} from "../../utils/alerts";
import { SOLICITUD_LIMITS, validateFields } from "../../utils/fieldLimits";

import "./SolicitudAdopcionPage.css";

function SolicitudAdopcionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [michi, setMichi] = useState(null);
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const [form, setForm] = useState({
    motivo: "",
    telefonoContacto: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const isPendiente = solicitud?.estadoSolicitud === "Pendiente";
  const isAprobada = solicitud?.estadoSolicitud === "Aprobada";
  const isRechazada = solicitud?.estadoSolicitud === "Rechazada";
  const isNueva = !solicitud;
  const canSubmit = isNueva || isPendiente || isRechazada;

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    setFieldErrors(validateFields(form, SOLICITUD_LIMITS));
  }, [form]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const michiRes = await api.get(`/gatos/${id}`);
      setMichi(michiRes.data);

      const solicitudRes = await api.get(`/solicitudes/michi/${id}`);
      if (solicitudRes.data.existe) {
        setSolicitud(solicitudRes.data.solicitud);
        setForm({
          motivo: solicitudRes.data.solicitud.motivo,
          telefonoContacto: solicitudRes.data.solicitud.telefonoContacto,
        });
      } else {
        setSolicitud(null);
      }
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateFields(form, SOLICITUD_LIMITS);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      if (isPendiente) {
        await api.put(`/solicitudes/${solicitud._id}/mi`, {
          motivo: form.motivo,
          telefonoContacto: form.telefonoContacto,
        });

        await successAlert(
          "Solicitud actualizada",
          "Tus datos fueron guardados correctamente."
        );
      } else {
        await api.post("/solicitudes", {
          gato: id,
          motivo: form.motivo,
          telefonoContacto: form.telefonoContacto,
        });

        await successAlert(
          "Solicitud enviada",
          "Tu solicitud fue registrada correctamente."
        );
      }

      navigate("/michis");
    } catch (error) {
      console.error(error);

      errorAlert("Error", error);
    } finally {
      setSubmitting(false);
    }
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
      await api.delete(`/solicitudes/${solicitud._id}/mi`);

      await successAlert(
        "Solicitud cancelada",
        "Tu solicitud fue eliminada correctamente.",
      );

      navigate("/michis");
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    } finally {
      setCanceling(false);
    }
  };

  const hasValidationErrors = Object.keys(fieldErrors).length > 0;

  const getTitle = () => {
    if (isPendiente) return "Editar solicitud";
    if (isAprobada) return "Tu solicitud";
    if (isRechazada) return "Enviar nueva solicitud";
    return "Solicitud de adopción";
  };

  const getFormTitle = () => {
    if (isPendiente) return "Editá tu solicitud";
    if (isRechazada) return "Completá tu nueva solicitud";
    return "Completá tu solicitud";
  };

  const getSubmitLabel = () => {
    if (isPendiente) return "Guardar cambios";
    if (isRechazada) return "Enviar nueva solicitud";
    return "Enviar solicitud";
  };

  return (
    <div className="solicitud-page">
      <TitleBar
        title={getTitle()}
        backTo="/michis"
      />

      {loading ? (
        <SolicitudAdopcionSkeleton />
      ) : michi ? (
        <div className="adopcion-card">
          <MichiInfo michi={michi} />

          {isAprobada && (
            <div className="adopcion-card__estado adopcion-card__estado--aprobada" role="status">
              Solicitud aprobada
            </div>
          )}

          {isRechazada && (
            <div className="adopcion-card__estado adopcion-card__estado--rechazada" role="status">
              Solicitud rechazada
            </div>
          )}

          {canSubmit && (
            <section className="adopcion-card__form-section">
              <h2>{getFormTitle()}</h2>

              <form onSubmit={handleSubmit}>
                <div className="adopcion-card__textarea-field">
                  <textarea
                    placeholder="¿Por qué querés adoptar este michi?"
                    required
                    rows={5}
                    value={form.motivo}
                    minLength={SOLICITUD_LIMITS.motivo.min}
                    maxLength={SOLICITUD_LIMITS.motivo.max}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        motivo: e.target.value,
                      })
                    }
                  />
                  <span className="form-char-counter">
                    {form.motivo.length} / {SOLICITUD_LIMITS.motivo.max}
                  </span>
                  {fieldErrors.motivo && (
                    <p className="form-field-error" role="alert">{fieldErrors.motivo}</p>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Teléfono de contacto"
                  required
                  value={form.telefonoContacto}
                  minLength={SOLICITUD_LIMITS.telefonoContacto.min}
                  maxLength={SOLICITUD_LIMITS.telefonoContacto.max}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telefonoContacto: e.target.value,
                    })
                  }
                />
                {fieldErrors.telefonoContacto && (
                  <p className="form-field-error" role="alert">{fieldErrors.telefonoContacto}</p>
                )}

                <button type="submit" disabled={submitting || canceling || hasValidationErrors}>
                  {submitting ? <Spinner /> : getSubmitLabel()}
                </button>

                {isPendiente && (
                  <button
                    type="button"
                    className="adopcion-card__btn-cancelar"
                    disabled={submitting || canceling}
                    onClick={handleCancelSolicitud}
                  >
                    {canceling ? <Spinner /> : "Cancelar solicitud"}
                  </button>
                )}
              </form>
            </section>
          )}

          {isAprobada && (
            <section className="adopcion-card__readonly">
              <h2>Detalle de tu solicitud</h2>
              <div className="adopcion-card__readonly-item">
                <span>Motivo</span>
                <p>{solicitud.motivo}</p>
              </div>
              <div className="adopcion-card__readonly-item">
                <span>Teléfono de contacto</span>
                <p>{solicitud.telefonoContacto}</p>
              </div>
            </section>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default SolicitudAdopcionPage;
