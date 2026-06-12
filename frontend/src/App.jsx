import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminMenuPage/AdminMenuPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import MichiFormPage from "./pages/MichiFormPage/MichiFormPage";
import MichisPage from "./pages/MichisPage/MichisPage";
import SolicitudAdopcionPage from "./pages/SolicitudAdopcionPage/SolicitudAdopcionPage.jsx";
import SolicitudesPage from "./pages/SolicitudesPage/SolicitudesPage";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {user && <Header />}
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly> <AdminDashboard /> </ProtectedRoute>} />
          <Route path="/michis" element={<ProtectedRoute> <MichisPage /> </ProtectedRoute>} />
          <Route path="/solicitudes" element={<ProtectedRoute adminOnly><SolicitudesPage /></ProtectedRoute>}/>          <Route path="*" element={<Navigate to={user ? "/michis" : "/login"} />} />
          <Route path="/michis/nuevo" element={<ProtectedRoute adminOnly><MichiFormPage /></ProtectedRoute>}/>
          <Route path="/michis/editar/:id" element={<ProtectedRoute adminOnly><MichiFormPage /></ProtectedRoute>}/>
          <Route path="/adoptar/:id" element={<ProtectedRoute><SolicitudAdopcionPage /></ProtectedRoute>}/>
        </Routes>
      </main>
      {user && <Footer />}
    </BrowserRouter>
  );
}

export default App;
