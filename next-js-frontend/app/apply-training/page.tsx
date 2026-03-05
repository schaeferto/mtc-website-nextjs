"use client";

import { useState, useEffect } from "react";
import Step1Activity from "./step1-activity";
import Step2Details from "./step2-details";
import ConfirmationPage from "./confirmation";

interface TrainingOption {
  id: number;
  documentId: string;
  title: string;
}

interface EventOption {
  id: number;
  documentId: string;
  date: string;
  training: TrainingOption;
  location: {
    name: string;
    imageName: string;
  } | null;
}

interface FormData {
  activity: string;
  event: string;
  eventId: string;
  name: string;
  email: string;
  over18: boolean;
}

export default function ApplyTrainingPage() {
  const [step, setStep] = useState(1);
  const [trainings, setTrainings] = useState<TrainingOption[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    activity: "",
    event: "",
    eventId: "",
    name: "",
    email: "",
    over18: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainingsAndEvents();
  }, []);

  // client-side fetch with simple retry logic; this keeps retries close to the
  // UX and lets the API route remain thin. You could also add similar retry
  // behavior inside `/api/event-options` if you expect Strapi to flake often.
  const fetchTrainingsAndEvents = async () => {
    setFetchError(null);
    setLoading(true);

    const maxAttempts = 3;
    let attempt = 0;
    let lastError: any = null;

    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        const eventsRes = await fetch("/api/event-options");
        if (!eventsRes.ok) {
          throw new Error(`HTTP ${eventsRes.status}`);
        }
        const eventsData = await eventsRes.json();

        const eventsList: EventOption[] = Array.isArray(eventsData)
          ? eventsData
          : [];
        setEvents(eventsList);

        // Derive unique trainings from events
        const uniqueTrainingsMap = new Map<string, TrainingOption>();
        eventsList.forEach((event) => {
          if (
            event.training &&
            !uniqueTrainingsMap.has(event.training.documentId)
          ) {
            uniqueTrainingsMap.set(event.training.documentId, event.training);
          }
        });

        setTrainings(Array.from(uniqueTrainingsMap.values()));
        lastError = null;
        break; // success
      } catch (err: any) {
        lastError = err;
        console.warn(`fetch attempt ${attempt} failed`, err);
        if (attempt < maxAttempts) {
          // wait before retrying
          await new Promise((r) => setTimeout(r, 500 * attempt));
        }
      }
    }

    if (lastError) {
      console.error("All fetch attempts failed", lastError);
      const errorMessage = lastError.message?.includes("504")
        ? "Der Server antwortet zu langsam. Bitte versuche es in einer Minute erneut."
        : "Beim Laden der Trainingsoptionen ist ein Fehler aufgetreten. Bitte versuche es erneut.";
      setFetchError(errorMessage);
    }

    setLoading(false);
  };

  const handleStep1Submit = (data: {
    activity: string;
    event: string;
    eventId: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
    setStep(2);
  };

  const handleStep2Submit = async (data: {
    name: string;
    email: string;
    over18: boolean;
  }) => {
    const finalData = { ...formData, ...data };
    setFormData(finalData);
    setSubmissionError(null);

    // Submit to backend
    try {
      const response = await fetch("/api/apply-training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        const errorMessage = `${
          errorData.error ||
          "Anmeldung fehlgeschlagen. Bitte versuche es erneut."
        } ${`Wenn das Problem weiterhin besteht, kontaktiere uns bitte per E‑Mail. munichtriathlonclub@gmail.com`}`;
        setSubmissionError(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError(
        "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
      );
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  if (loading) {
    return (
      <div
        className="first-content flex justify-center"
        style={{ padding: "20px" }}
      >
        <div className="w-full p-6 text-center flex flex-col items-center mt-48">
          {/* Finite progress bar animation */}
          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-mtc-yellow"
              style={{
                animation: "progress 10s ease-in-out forwards",
              }}
            />
          </div>
          <p className="text-lg font-medium mb-2">Lade Trainingsoptionen...</p>
          <p className="text-sm text-gray-500">
            Dies kann auf langsamen Verbindungen bis zu 10 Sekunden dauern.
          </p>

          {/* Add CSS animation keyframes */}
          <style>
            {`
              @keyframes progress {
                0% {
                  width: 0%;
                  opacity: 1;
                }
                100% {
                  width: 100%;
                  opacity: 1;
                }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        className="first-content flex justify-center"
        style={{ padding: "20px" }}
      >
        <div className="w-full p-6 text-center flex flex-col items-center md:mt-48 mt-12">
          <p className="text-red-600 mb-20">{fetchError}</p>
          <button
            onClick={fetchTrainingsAndEvents}
            className="bg-mtc-yellow py-3 px-8 text-xl rounded-full text-black w-[300px] font-medium mx-auto"
          >
            ERNEUT LADEN
          </button>
          <p className="text-sm text-gray-400 mt-20 text-center max-w-lg">
            Sollte das Tool weiterhin nicht funktionieren, schreibe uns bitte
            eine E‑Mail an{" "}
            <a
              href="mailto:munichtriathlonclub@gmail.com"
              className="underline"
            >
              munichtriathlonclub@gmail.com
            </a>{" "}
            und wir melden uns direkt bei dir.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return <ConfirmationPage email={formData.email} />;
  }

  const handleStep2Change = (
    data: Partial<Pick<FormData, "name" | "email" | "over18">>,
  ) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="first-content">
      {submissionError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex justify-between items-start">
            <p className="text-red-700">{submissionError}</p>
            <button
              onClick={() => setSubmissionError(null)}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {step === 1 && (
        <Step1Activity
          trainings={trainings}
          events={events}
          formData={formData}
          onSubmit={handleStep1Submit}
        />
      )}
      {step === 2 && (
        <Step2Details
          formData={formData}
          onSubmit={handleStep2Submit}
          onBack={handleBack}
          onChange={handleStep2Change}
        />
      )}
    </div>
  );
}
