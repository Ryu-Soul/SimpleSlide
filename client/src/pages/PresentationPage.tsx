import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Step = {
  id: number;
  presentationId: number;
  type: string;
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    imageUrl?: string;
    caption?: string;
  };
  position: number;
};

export default function PresentationPage() {
  const { id } = useParams();

  const [steps, setSteps] = useState<Step[]>([]);
  const [type, setType] = useState("title");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  async function fetchSteps() {
    if (!id) {
      setError("Présentation introuvable");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/steps?presentationId=${id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors du chargement des étapes");
        return;
      }

      setSteps(data.steps);
    } catch {
      setError("Erreur serveur");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSteps();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!id) {
      setError("Présentation introuvable");
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);

    let content: Record<string, string> = {};

    if (type === "title") {
    content = {
        title,
        subtitle,
    };
    }

    if (type === "text") {
    content = {
        title,
        text,
    };
    }

    if (type === "image") {
    content = {
        imageUrl,
        caption,
    };
    }

    try {
      const response = await fetch("http://localhost:5000/steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          presentationId: Number(id),
          type,
          content,
          position: steps.length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de l'ajout de l'étape");
        return;
      }

      setMessage("Étape ajoutée avec succès");
      setTitle("");
      setSubtitle("");
      setText("");
      setImageUrl("");
      setCaption("");

      await fetchSteps();
    } catch {
      setError("Erreur serveur");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  return (
    <section>
      <h1>Présentation #{id}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="title">Title</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>

        <div>
          <label htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {type === "title" && (
          <div>
            <label htmlFor="subtitle">Sous-titre</label>
            <input
              id="subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
        )}

        {type === "text" && (
          <div>
            <label htmlFor="text">Texte</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        )}

        {type === "image" && (
        <>
            <div>
            <label htmlFor="imageUrl">URL de l'image</label>
            <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
            />
            </div>

            <div>
            <label htmlFor="caption">Légende</label>
            <input
                id="caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Description de l'image"
            />
            </div>
        </>
        )}

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ajout..." : "Ajouter une étape"}
        </button>
      </form>

      <hr />

      <h2>Étapes</h2>

      {steps.length === 0 && <p>Aucune étape pour le moment.</p>}

      {steps.length > 0 && (
        <ul>
          {steps.map((step) => (
            <li key={step.id}>
              <p>Type : {step.type}</p>

              {step.type === "title" && (
                <div>
                  <h3>{step.content.title}</h3>
                  <p>{step.content.subtitle}</p>
                </div>
              )}

              {step.type === "text" && (
                <div>
                  <h3>{step.content.title}</h3>
                  <p>{step.content.text}</p>
                </div>
              )}

              {step.type === "image" && (
                <div>
                    {step.content.imageUrl && (
                    <img
                        src={step.content.imageUrl}
                        alt={step.content.caption || "Illustration"}
                        style={{ maxWidth: "300px" }}
                    />
                    )}
                    <p>{step.content.caption}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}