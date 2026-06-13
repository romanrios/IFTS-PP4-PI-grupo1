import Skeleton from "../Skeleton/Skeleton";
import "../../pages/MichiFormPage/MichiFormPage.css";
import "./MichiFormSkeleton.css";

function MichiFormSkeleton() {
  return (
    <div className="michi-form michi-form-skeleton">
      <Skeleton className="michi-form-skeleton__field" />
      <Skeleton className="michi-form-skeleton__field" />
      <Skeleton className="michi-form-skeleton__field" />
      <Skeleton className="michi-form-skeleton__field" />
      <Skeleton className="michi-form-skeleton__field" />
      <Skeleton className="michi-form-skeleton__field michi-form-skeleton__field--tall" />
      <Skeleton className="michi-form-skeleton__button" />
    </div>
  );
}

export default MichiFormSkeleton;
