import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Presentation = {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
};

type Step = {
  id: number;
  presentationId: number;
  type: string;
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
  };
  position: number;
};

export default function PresentationViewPage() {
  const { id } = useParams();

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPresentationData() {
      if (!id) {
        setError("Présentation introuvable");
        setIsLoading(false);
        return;
      }

      try {
        const [presentationResponse, stepsResponse] = await Promise.all([
          fetch(`http://localhost:5000/presentations/${id}`),
          fetch(`http://localhost:5000/steps?presentationId=${id}`),
        ]);

        const presentationData = await presentationResponse.json();
        const stepsData = await stepsResponse.json();

        if (!presentationResponse.ok) {
          setError(
            presentationData.message ||
              "Erreur lors du chargement de la présentation"
          );
          return;
        }

        if (!stepsResponse.ok) {
          setError(
            stepsData.message || "Erreur lors du chargement des étapes"
          );
          return;
        }

        setPresentation(presentationData.presentation);
        setSteps(stepsData.steps);
      } catch {
        setError("Erreur serveur");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPresentationData();
  }, [id]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        setCurrentStepIndex((prev) =>
          prev < steps.length - 1 ? prev + 1 : prev
        );
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [steps.length]);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!presentation) {
    return <p>Présentation introuvable.</p>;
  }

  const currentStep = steps[currentStepIndex];

  return (
    <section>
      <header>
        <h1>{presentation.title}</h1>
        <p>
          Étape {steps.length === 0 ? 0 : currentStepIndex + 1} / {steps.length}
        </p>
      </header>

      {steps.length === 0 && <p>Aucune étape dans cette présentation.</p>}

      {steps.length > 0 && currentStep && (
        <article>
          {currentStep.type === "title" && (
            <div>
              <h2>{currentStep.content.title}</h2>
              <p>{currentStep.content.subtitle}</p>
            </div>
          )}

          {currentStep.type === "text" && (
            <div>
              <h2>{currentStep.content.title}</h2>
              <p>{currentStep.content.text}</p>
            </div>
          )}
        </article>
      )}

      {steps.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() =>
              setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev))
            }
            disabled={currentStepIndex === 0}
          >
            Précédent
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentStepIndex((prev) =>
                prev < steps.length - 1 ? prev + 1 : prev
              )
            }
            disabled={currentStepIndex === steps.length - 1}
          >
            Suivant
          </button>
        </div>
      )}
    </section>
  );
}