import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import MichiCard from "../components/MichiCard/MichiCard";
import "../styles/michisPages.css";



function MichisPage() {
  const michis = [
    {
      _id: 1,
      nombre: "Pancito",
      edadAprox: "1 año",
      sexo: "M",
      descripcion: "Tranquilo y cariñoso",
      foto:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006",
    },
    {
      _id: 2,
      nombre: "Riku",
      edadAprox: "1 año",
      sexo: "M",
      descripcion: "Travieso y curioso",
      foto:
        "https://images.unsplash.com/photo-1519052537078-e6302a4968d4",
    },
  ];

  return (
    <>
      
      <div className="michis-page">
        <h1>Gestionar michis</h1>

        <button className="btn-add">+ Agregar michi</button>

        
        <div className="michis-grid">
          {michis.map((michi) => (
            <MichiCard
              key={michi._id}
              michi={michi}
            />
          ))}
        </div>
      </div>
      
    </>
  );
}

export default MichisPage;