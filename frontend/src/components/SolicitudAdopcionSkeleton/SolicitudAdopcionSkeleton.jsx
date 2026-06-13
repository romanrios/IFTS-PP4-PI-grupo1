import Skeleton from "../Skeleton/Skeleton";
import "../../pages/SolicitudAdopcionPage/SolicitudAdopcionPage.css";
import "./SolicitudAdopcionSkeleton.css";

function SolicitudAdopcionSkeleton() {
  return (
    <div className="solicitud-card solicitud-adopcion-skeleton">
      <Skeleton className="solicitud-adopcion-skeleton__image" />
      <Skeleton className="solicitud-adopcion-skeleton__title" />
      <Skeleton className="solicitud-adopcion-skeleton__field" />
      <Skeleton className="solicitud-adopcion-skeleton__field solicitud-adopcion-skeleton__field--tall" />
      <Skeleton className="solicitud-adopcion-skeleton__field" />
      <Skeleton className="solicitud-adopcion-skeleton__button" />
    </div>
  );
}

export default SolicitudAdopcionSkeleton;
