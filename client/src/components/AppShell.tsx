import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/appshell.scss";

export default function AppShell() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div>
          <h2>SimpleSlide</h2>
          <p>{user?.email}</p>
        </div>

        <nav className="app-shell__nav">
          <NavLink to="/app">Dashboard</NavLink>
          <NavLink to="/app/slides">Mes slides</NavLink>
          <NavLink to="/app/create">Créer une présentation</NavLink>
        </nav>
      </aside>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
}