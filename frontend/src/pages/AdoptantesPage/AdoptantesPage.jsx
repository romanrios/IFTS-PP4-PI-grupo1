import TitleBar from "../../components/TitleBar/TitleBar";
import "./AdoptantesPage.css";


function AdoptantesPage() {
  return (
    <div className="adoptantesPage">
      <TitleBar title="Ver adoptantes" backTo="/admin"/>
    </div>
  );
}

export default AdoptantesPage;
