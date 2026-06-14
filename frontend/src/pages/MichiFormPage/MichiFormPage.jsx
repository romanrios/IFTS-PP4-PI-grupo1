import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import MichiFormSkeleton from "../../components/MichiFormSkeleton/MichiFormSkeleton";
import Spinner from "../../components/Spinner/Spinner";
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
  const [imageFile, setImageFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loadingData, setLoadingData] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadMichi();
    }
  }, [id]);

  useEffect(() => {
    if (!imageFile) {
      setFilePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setFilePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const loadMichi = async () => {
    setLoadingData(true);

    try {
      const res = await api.get(`/gatos/${id}`);
      setForm(res.data);
    } catch (error) {
      console.error(error);
      errorAlert("Error", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Solo se permiten archivos de imagen (jpg, png, gif, webp, etc.).");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  const buildPayload = () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("edadAprox", form.edadAprox);
      formData.append("sexo", form.sexo);
      formData.append("descripcion", form.descripcion);
      formData.append("estadoAdopcion", form.estadoAdopcion);
      formData.append("foto", imageFile);
      return formData;
    }

    return form;
  };

  const previewSrc = imageFile ? filePreviewUrl : form.foto || null;
  const showFilePriorityHint = Boolean(imageFile && form.foto);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileError) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = buildPayload();

      if (isEdit) {
        await api.put(`/gatos/${id}`, payload);

        await successAlert(
          "Cambios guardados",
          "La información fue actualizada.",
        );
      } else {
        await api.post("/gatos", payload);

        await successAlert(
          "Michi creado",
          "El michi fue registrado correctamente.",
        );
      }

      navigate("/michis");
    } catch (error) {
      console.error(error);
      await errorAlert("Error", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="michi-form-page">
      <TitleBar
        title={isEdit ? "Editar michi" : "Agregar michi"}
        backTo="/michis"
      />

      {loadingData ? (
        <MichiFormSkeleton />
      ) : (
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

        <div className="michi-form__foto-section">
          <input
            name="foto"
            placeholder="URL foto"
            value={form.foto}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="michi-form__file-input"
          />

          <p className="michi-form__foto-hint">
            Podés ingresar una URL o seleccionar un archivo local.
          </p>

          {showFilePriorityHint && (
            <p className="michi-form__foto-hint michi-form__foto-hint--priority">
              Si completaste ambas opciones, se utilizará la imagen del archivo seleccionado.
            </p>
          )}

          {fileError && (
            <p className="michi-form__foto-error" role="alert">
              {fileError}
            </p>
          )}

          {previewSrc && (
            <div className="michi-form__foto-preview">
              <img src={previewSrc} alt="Vista previa de la foto" />
            </div>
          )}
        </div>

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

        <button type="submit" disabled={submitting}>
          {submitting ? (
            <Spinner />
          ) : isEdit ? (
            "Guardar cambios"
          ) : (
            "Crear michi"
          )}
        </button>
      </form>
      )}
    </div>
  );
}

export default MichiFormPage;
