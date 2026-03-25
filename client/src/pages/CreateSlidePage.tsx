import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreateSlidePage() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      setError("Utilisateur non connecté");
      return;
    }

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/presentations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de la création");
        return;
      }

      setMessage("Présentation créée avec succès");
      setTitle("");
    } catch (err) {
      setError("Erreur serveur");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <h1>Créer une présentation</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ma présentation"
          />
        </div>

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer"}
        </button>
      </form>
    </section>
  );}