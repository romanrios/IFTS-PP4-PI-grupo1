import Swal from "sweetalert2";

export const successAlert = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#ff6d40",
  });

export const errorAlert = (title, text) =>
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#ff6d40",
  });

export const confirmAlert = (title, text) =>
  Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#ff6d40",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  });