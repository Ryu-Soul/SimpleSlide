import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Presentation = {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
};

export default function SlidesPage() {
  const { user } = useAuth();

  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPresentations() {
      if (!user) {
        setError("Utilisateur non connecté");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/presentations?userId=${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Erreur lors du chargement");
          return;
        }

        setPresentations(data.presentations);
      } catch (err) {
        setError("Erreur serveur");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPresentations();
  }, [user]);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  return (
    <section>
      <h1>Mes slides</h1>

      {error && <p>{error}</p>}

      {!error && presentations.length === 0 && (
        <p>Aucune présentation pour le moment.</p>
      )}

      {presentations.length > 0 && (
        <ul>
          {presentations.map((presentation) => (
            <li key={presentation.id}>
                <h2>{presentation.title}</h2>
                <p>Créée le : {presentation.createdAt}</p>
                <NavLink to={`/app/presentations/${presentation.id}`}>Ouvrir</NavLink>
                <NavLink to={`/app/presentations/${presentation.id}/view`}>Voir</NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}