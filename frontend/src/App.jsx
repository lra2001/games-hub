import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Login from "./auth/Login.jsx";
import PasswordResetRequest from "./auth/PasswordResetRequest.jsx";
import ResetPassword from "./auth/PasswordResetConfirm.jsx";
import Register from "./auth/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GameSearch from "./pages/GameSearch.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import GameDetail from "./pages/GameDetail.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />
        <Route path="/password-reset-confirm/:uid/:token" element={<ResetPassword />} />
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

        {/* 404 - Handle Page not Found */}
        <Route path="*" element={<NotFound />} />

        {/* Search page */}
        <Route path="/search" element={<GameSearch />} />
      </Routes>
    </BrowserRouter>
  );
}