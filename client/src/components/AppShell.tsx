import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/appshell.scss";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div>
          <h2>SimpleSlide</h2>
          <p>{user?.email}</p>
        </div>

        <nav className="app-shell__nav">
          <Link to="/app">Dashboard</Link>
          <button type="button">Mes slides</button>
          <button type="button">Créer une présentation</button>
        </nav>

      </aside>

      <main className="app-shell__content">{children}</main>
    </div>
  );
}