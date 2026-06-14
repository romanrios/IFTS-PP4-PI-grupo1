import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import MichiFormSkeleton from "../../components/MichiFormSkeleton/MichiFormSkeleton";
import Spinner from "../../components/Spinner/Spinner";
import TitleBar from "../../components/TitleBar/TitleBar";
import { errorAlert, successAlert } from "../../utils/alerts";
import { GATO_LIMITS, getLengthError, validateFields } from "../../utils/fieldLimits";
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
  const [fieldErrors, setFieldErrors] = useState({});
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

  const getFormErrors = () => {
    const errors = validateFields(form, GATO_LIMITS, {
      foto: { allowEmpty: true },
    });

    if (!imageFile && form.foto) {
      const fotoError = getLengthError(form.foto, GATO_LIMITS.foto);

      if (fotoError) {
        errors.foto = fotoError;
      }
    } else {
      delete errors.foto;
    }

    return errors;
  };

  useEffect(() => {
    setFieldErrors(getFormErrors());
  }, [form, imageFile]);

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
  const hasValidationErrors =
    Object.keys(fieldErrors).length > 0 || Boolean(fileError);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = getFormErrors();
    setFieldErrors(errors);

    if (fileError || Object.keys(errors).length > 0) {
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
          minLength={GATO_LIMITS.nombre.min}
          maxLength={GATO_LIMITS.nombre.max}
          required
        />
        {fieldErrors.nombre && (
          <p className="form-field-error" role="alert">{fieldErrors.nombre}</p>
        )}

        <input
          name="edadAprox"
          placeholder="Edad aproximada"
          value={form.edadAprox}
          onChange={handleChange}
          minLength={GATO_LIMITS.edadAprox.min}
          maxLength={GATO_LIMITS.edadAprox.max}
          required
        />
        {fieldErrors.edadAprox && (
          <p className="form-field-error" role="alert">{fieldErrors.edadAprox}</p>
        )}

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
            maxLength={GATO_LIMITS.foto.max}
          />
          {fieldErrors.foto && (
            <p className="form-field-error" role="alert">{fieldErrors.foto}</p>
          )}

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

        <div className="michi-form__textarea-field">
          <textarea
            name="descripcion"
            placeholder="Descripción"
            rows="5"
            value={form.descripcion}
            onChange={handleChange}
            minLength={GATO_LIMITS.descripcion.min}
            maxLength={GATO_LIMITS.descripcion.max}
            required
          />
          <span className="form-char-counter">
            {form.descripcion.length} / {GATO_LIMITS.descripcion.max}
          </span>
          {fieldErrors.descripcion && (
            <p className="form-field-error" role="alert">{fieldErrors.descripcion}</p>
          )}
        </div>

        <button type="submit" disabled={submitting || hasValidationErrors}>
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
