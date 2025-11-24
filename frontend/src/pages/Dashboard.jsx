import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        <h1>Welcome to your Library</h1>
        <Outlet />
      </main>
    </div>
  );
}