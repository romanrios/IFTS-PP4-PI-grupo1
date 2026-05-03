import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL)
      .then((res) => setMensaje(res.data))
      .catch((err) => console.log(err));
  }, []);

  console.log("API URL:", process.env.REACT_APP_API_URL);

  return (
    <div className="app">
      <header>Header</header>
      <main>
        <h1>MichiGestión</h1>
        <p>{mensaje}</p>
      </main>
      <footer>Footer</footer>
    </div>
  );
}

export default App;
