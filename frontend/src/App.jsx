import { useEffect, useState } from "react";
import api from "./api";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import { useAuth } from "./context/AuthContext";

function App() {
  const [mensaje, setMensaje] = useState(""); // mensaje ruta "/" "API funcionando" 

  const { user, loading } = useAuth();

  useEffect(() => {
    api
      .get("/")
      .then((res) => setMensaje(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="app">
      <header>Header</header>

      <main>
        <h1>MichiGestión</h1>

        <p>{mensaje}</p>

        {loading ? <p>Cargando...</p> : user ? <UserProfile /> : <Login />}
      </main>

      <footer>Footer</footer>
    </div>
  );
}

export default App;
