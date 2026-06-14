import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import MichiInfo from "../../components/MichiInfo/MichiInfo";
import SolicitudAdopcionSkeleton from "../../components/SolicitudAdopcionSkeleton/SolicitudAdopcionSkeleton";
import Spinner from "../../components/Spinner/Spinner";
import TitleBar from "../../components/TitleBar/TitleBar";
import {
  errorAlert,
  successAlert,
} from "../../utils/alerts";
import { SOLICITUD_LIMITS, validateFields } from "../../utils/fieldLimits";

import "./SolicitudAdopcionPage.css";

function SolicitudAdopcionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [michi, setMichi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    motivo: "",
    telefonoContacto: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchMichi();
  }, []);

  useEffect(() => {
    setFieldErrors(validateFields(form, SOLICITUD_LIMITS));
  }, [form]);

  const fetchMichi = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/gatos/${id}`);
      setMichi(res.data);
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
      await api.post("/solicitudes", {
        gato: id,
        motivo: form.motivo,
        telefonoContacto: form.telefonoContacto,
      });

      await successAlert(
        "Solicitud enviada",
        "Tu solicitud fue registrada correctamente."
      );

      navigate("/michis");
    } catch (error) {
      console.error(error);

      errorAlert("Error", error);
    } finally {
      setSubmitting(false);
    }
  };

  const hasValidationErrors = Object.keys(fieldErrors).length > 0;

  return (
    <div className="solicitud-page">
      <TitleBar
        title="Solicitud de adopción"
        backTo="/michis"
      />

      {loading ? (
        <SolicitudAdopcionSkeleton />
      ) : michi ? (
        <div className="solicitud-card">
          <MichiInfo michi={michi} />

          <section className="solicitud-card__form-section">
            <h2>Completá tu solicitud</h2>

            <form onSubmit={handleSubmit}>
              <div className="solicitud-card__textarea-field">
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

              <button type="submit" disabled={submitting || hasValidationErrors}>
                {submitting ? <Spinner /> : "Enviar solicitud"}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default SolicitudAdopcionPage;
