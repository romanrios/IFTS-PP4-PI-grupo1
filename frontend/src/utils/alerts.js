import Swal from "sweetalert2";

const confirmButtonColor = "#ff6d40";
const cancelButtonColor = "#dc3545";

export const getErrorMessage = (
  error,
  fallback = "Ocurrió un error inesperado",
) => error?.response?.data?.message || fallback;

export const successAlert = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
  });

export const errorAlert = (title, textOrError) => {
  const text =
    typeof textOrError === "string"
      ? textOrError
      : getErrorMessage(textOrError);

  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor,
  });
};

export const confirmAlert = (title, text, options = {}) =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText: options.confirmButtonText || "Sí",
    cancelButtonText: "Cancelar",
  });

export const deleteConfirmAlert = (title, text) =>
  confirmAlert(title, text, { confirmButtonText: "Sí, eliminar" });
