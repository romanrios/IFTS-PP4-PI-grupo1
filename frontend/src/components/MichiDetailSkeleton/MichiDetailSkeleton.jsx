import Skeleton from "../Skeleton/Skeleton";
import "../../pages/MichiDetailPage/MichiDetailPage.css";
import "./MichiDetailSkeleton.css";

function MichiDetailSkeleton() {
  return (
    <div className="michi-detail michi-detail-skeleton">
      <Skeleton className="michi-detail-skeleton__image" />

      <div className="michi-detail__header">
        <Skeleton className="michi-detail-skeleton__title" />
        <Skeleton className="michi-detail-skeleton__badge" />
      </div>

      <div className="michi-detail__info">
        <Skeleton className="michi-detail-skeleton__info-item" />
        <Skeleton className="michi-detail-skeleton__info-item" />
        <Skeleton className="michi-detail-skeleton__info-item" />
        <Skeleton className="michi-detail-skeleton__info-item" />
      </div>

      <div className="michi-detail__description">
        <Skeleton className="michi-detail-skeleton__section-title" />
        <Skeleton className="michi-detail-skeleton__line" />
        <Skeleton className="michi-detail-skeleton__line" />
        <Skeleton className="michi-detail-skeleton__line michi-detail-skeleton__line--short" />
      </div>

      <Skeleton className="michi-detail-skeleton__button" />
    </div>
  );
}

export default MichiDetailSkeleton;
