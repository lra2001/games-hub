import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GameSearch from "./pages/GameSearch.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import GameDetail from "./pages/GameDetail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/games/:id" element={<GameDetail />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Search page */}
        <Route path="/search" element={<GameSearch />} />
      </Routes>
    </BrowserRouter>
  );
}