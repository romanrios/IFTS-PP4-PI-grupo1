import { Loader2 } from "lucide-react";
import "./Spinner.css";

function Spinner({ size = 18, className = "" }) {
  return (
    <Loader2
      className={`spinner ${className}`.trim()}
      size={size}
      aria-hidden="true"
    />
  );
}

export function PageLoader({ size = 32 }) {
  return (
    <div className="page-loader" role="status" aria-label="Cargando">
      <Spinner size={size} />
    </div>
  );
}

export default Spinner;
