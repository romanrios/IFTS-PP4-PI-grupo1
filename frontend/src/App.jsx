import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminMenuPage";
import AdoptantesPage from "./pages/AdoptantesPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import MichisPage from "./pages/MichisPage";

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
          <Route path="/adoptantes" element={<ProtectedRoute adminOnly> <AdoptantesPage /> </ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user ? "/michis" : "/login"} />} />
        </Routes>
      </main>
      {user && <Footer />}
    </BrowserRouter>
  );
}

export default App;
