import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GameSearch from "./pages/GameSearch.jsx";

export default function App() {
  function handleSearch(query) {
    // Redirect to search page with query
    window.location.href = `/search?query=${encodeURIComponent(query)}`;
  }

  return (
    <BrowserRouter>
      <Header onSearch={handleSearch} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/search" element={<GameSearch />} />
      </Routes>
    </BrowserRouter>
  );
}