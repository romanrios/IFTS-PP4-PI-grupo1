import Skeleton from "../Skeleton/Skeleton";
import "../../pages/SolicitudesPage/SolicitudesPage.css";
import "./SolicitudCardSkeleton.css";

function SolicitudCardSkeleton() {
  return (
    <article className="solicitud-card solicitud-card-skeleton">
      <div className="solicitud-card__header">
        <Skeleton className="solicitud-card-skeleton__avatar" />

        <div className="solicitud-card-skeleton__header-text">
          <Skeleton className="solicitud-card-skeleton__title" />
          <Skeleton className="solicitud-card-skeleton__line" />
          <Skeleton className="solicitud-card-skeleton__line solicitud-card-skeleton__line--short" />
        </div>
      </div>

      <div className="solicitud-card__body">
        <Skeleton className="solicitud-card-skeleton__line" />
        <Skeleton className="solicitud-card-skeleton__badge" />
        <Skeleton className="solicitud-card-skeleton__motivo" />
      </div>

      <div className="solicitud-card__actions">
        <Skeleton className="solicitud-card-skeleton__action" />
        <Skeleton className="solicitud-card-skeleton__action" />
        <Skeleton className="solicitud-card-skeleton__action" />
        <Skeleton className="solicitud-card-skeleton__action" />
      </div>
    </article>
  );
}

export default SolicitudCardSkeleton;
