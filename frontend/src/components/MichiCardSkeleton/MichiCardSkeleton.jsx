import Skeleton from "../Skeleton/Skeleton";
import "../MichiCard/MichiCard.css";
import "./MichiCardSkeleton.css";

function MichiCardSkeleton() {
  return (
    <article className="michi-card michi-card-skeleton">
      <Skeleton className="michi-card-skeleton__image" />

      <div className="michi-card__content">
        <Skeleton className="michi-card-skeleton__title" />
        <Skeleton className="michi-card-skeleton__info" />
        <Skeleton className="michi-card-skeleton__description" />
        <Skeleton className="michi-card-skeleton__description michi-card-skeleton__description--short" />

        <div className="michi-card__actions">
          <Skeleton className="michi-card-skeleton__button" />
        </div>
      </div>
    </article>
  );
}

export default MichiCardSkeleton;
