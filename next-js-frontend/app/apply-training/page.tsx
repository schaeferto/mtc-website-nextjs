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

  useEffect(() => {
    fetchTrainingsAndEvents();
  }, []);

  const fetchTrainingsAndEvents = async () => {
    try {
      setFetchError(null);
      setLoading(true);
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
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setFetchError(
        "Beim Laden der Trainingsoptionen ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      );
    } finally {
      setLoading(false);
    }
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
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  if (loading) {
    return (
      <div
        className="first-content"
        style={{ padding: "20px", textAlign: "center" }}
      >
        <p>Loading training options...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        className="first-content flex justify-center"
        style={{ padding: "20px" }}
      >
        <div className="w-full p-6 text-center flex flex-col items-center mt-48">
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
