import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import TitleBar from "../../components/TitleBar/TitleBar";
import { errorAlert, successAlert } from "../../utils/alerts";
import "./MichiFormPage.css";

function MichiFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nombre: "",
    edadAprox: "",
    sexo: "M",
    descripcion: "",
    foto: "",
    estadoAdopcion: "Publicado",
  });

  useEffect(() => {
    if (isEdit) {
      loadMichi();
    }
  }, [id]);

  const loadMichi = async () => {
    try {
      const res = await api.get(`/gatos/${id}`);
      setForm(res.data);
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await api.put(`/gatos/${id}`, form);

        await successAlert(
          "Cambios guardados",
          "La información fue actualizada.",
        );
      } else {
        await api.post("/gatos", form);

        await successAlert(
          "Michi creado",
          "El michi fue registrado correctamente.",
        );
      }

      navigate("/michis");
    } catch (error) {
      console.error(error);
      await errorAlert("Error", error);
    }
  };

  return (
    <div className="michi-form-page">
      <TitleBar
        title={isEdit ? "Editar michi" : "Agregar michi"}
        backTo="/michis"
      />

      <form className="michi-form" onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <input
          name="edadAprox"
          placeholder="Edad aproximada"
          value={form.edadAprox}
          onChange={handleChange}
          required
        />

        <select name="sexo" value={form.sexo} onChange={handleChange}>
          <option value="M">Macho</option>
          <option value="H">Hembra</option>
        </select>

        <input
          name="foto"
          placeholder="URL foto"
          value={form.foto}
          onChange={handleChange}
        />

        <select
          name="estadoAdopcion"
          value={form.estadoAdopcion}
          onChange={handleChange}
        >
          <option value="Publicado">Publicado</option>
          <option value="Con solicitudes">Con solicitudes</option>
          <option value="Adoptado">Adoptado</option>
          <option value="No publicado">No publicado</option>
        </select>

        <textarea
          name="descripcion"
          placeholder="Descripción"
          rows="5"
          value={form.descripcion}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {isEdit ? "Guardar cambios" : "Crear michi"}
        </button>
      </form>
    </div>
  );
}

export default MichiFormPage;
