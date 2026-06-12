import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "./TitleBar.css";

function TitleBar({ title, backTo }) {
  return (
    <div className="titleBar">
        <div>            
      {backTo && (
        <div className="titleBar__back">
        <Link to={backTo} >
          <ArrowLeft  size={33}  />
        </Link>
        </div>
      )}
      </div>
      <h2 className="titleBar__title">{title}</h2>
      <div></div>
    </div>
  );
}

export default TitleBar;
