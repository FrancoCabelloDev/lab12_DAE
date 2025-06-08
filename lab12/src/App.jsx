import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import SeriePage from "./pages/SeriePage";
import SerieFormPage from "./pages/SerieFormPage";

function App() {
  return (
    <Router>

      <main className="w-full px-4 py-4">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/series" element={<SeriePage />} />
          <Route path="/series/edit/:idserie" element={<SerieFormPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
