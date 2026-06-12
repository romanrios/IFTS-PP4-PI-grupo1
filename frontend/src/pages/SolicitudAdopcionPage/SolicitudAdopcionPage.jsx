import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import TitleBar from "../../components/TitleBar/TitleBar";
import { useAuth } from "../../context/AuthContext";
import {
    errorAlert,
    successAlert,
} from "../../utils/alerts";

import "./SolicitudAdopcionPage.css";

function SolicitudAdopcionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [michi, setMichi] = useState(null);

  const [form, setForm] = useState({
    motivo: "",
    telefonoContacto: "",
  });

  useEffect(() => {
    fetchMichi();
  }, []);

  const fetchMichi = async () => {
    try {
      const res = await api.get(`/gatos/${id}`);
      setMichi(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/solicitudes", {
        usuario: user._id,
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

      errorAlert(
        "Error",
        "No se pudo enviar la solicitud."
      );
    }
  };

  return (
    <div className="solicitud-page">
      <TitleBar
        title="Solicitud de adopción"
        backTo="/michis"
      />

      {michi && (
        <div className="solicitud-card">
          <img
            src={michi.foto}
            alt={michi.nombre}
          />

          <h2>{michi.nombre}</h2>

          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="¿Por qué querés adoptar este michi?"
              required
              rows={5}
              value={form.motivo}
              onChange={(e) =>
                setForm({
                  ...form,
                  motivo: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Teléfono de contacto"
              required
              value={form.telefonoContacto}
              onChange={(e) =>
                setForm({
                  ...form,
                  telefonoContacto: e.target.value,
                })
              }
            />

            <button type="submit">
              Enviar solicitud
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SolicitudAdopcionPage;