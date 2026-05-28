"use client";

import { useState, useEffect } from "react";
import Step1Activity, {
  ActivityOption,
  EventOption,
} from "./step1-activity";
import Step2Details from "./step2-details";
import ConfirmationPage from "./confirmation";
import { convertUTCToLocalTime } from "../utils/date-utils";

interface FormData {
  activity: string;
  event: string;
  eventId: string;
  eventDate: string;
  eventAddress: string;
  locationName: string;
  discipline: "Schwimmen" | "Laufen";
  name: string;
  email: string;
  over18: boolean;
}

function LoadingSkeleton() {
  return (
    <main className="max-w-[800px] mx-auto px-5 py-10 animate-pulse">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="h-8 bg-gray-200 rounded-full w-56 mx-auto mb-3" />
        <div className="h-4 bg-gray-200 rounded-full w-44 mx-auto mb-2" />
        <div className="h-3 bg-gray-200 rounded-full w-72 mx-auto" />
      </div>

      {/* Activity cards */}
      <div className="flex flex-col gap-3 mb-10">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="p-4 border-2 border-gray-100 rounded-2xl flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded-full w-24" />
              <div className="h-3 bg-gray-200 rounded-full w-52" />
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 shrink-0" />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-center mt-8">
        <div className="h-12 bg-gray-200 rounded-full w-32" />
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mt-8">
        <div className="w-3 h-3 rounded-full bg-gray-300" />
        <div className="w-3 h-3 rounded-full bg-gray-200" />
      </div>
    </main>
  );
}

export default function ApplyTrainingPage() {
  const [step, setStep] = useState(1);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    activity: "",
    event: "",
    eventId: "",
    eventDate: "",
    eventAddress: "",
    locationName: "",
    discipline: "Schwimmen",
    name: "",
    email: "",
    over18: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setFetchError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/event-options");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const eventsList: EventOption[] = Array.isArray(data) ? data : [];
      const eventsWithLocalDates = convertEventDatesToLocal(eventsList);
      setEvents(eventsWithLocalDates);

      const disciplineSet = new Set<"Schwimmen" | "Laufen">();
      eventsWithLocalDates.forEach((e) => disciplineSet.add(e.discipline));
      setActivities([
        ...(disciplineSet.has("Schwimmen")
          ? [{ value: "Schwimmen" as const, title: "Schwimmen" }]
          : []),
        ...(disciplineSet.has("Laufen")
          ? [{ value: "Laufen" as const, title: "Laufen" }]
          : []),
      ]);
    } catch {
      setFetchError(
        "Beim Laden der Trainingsoptionen ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      );
    }

    setLoading(false);
  };

  if (loading) return <LoadingSkeleton />;

  if (fetchError) {
    return (
      <div className="first-content flex justify-center px-5">
        <div className="w-full p-6 text-center flex flex-col items-center md:mt-48 mt-12">
          <p className="text-red-600 mb-20">{fetchError}</p>
          <button
            onClick={fetchEvents}
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

  if (submitted) return <ConfirmationPage email={formData.email} />;

  const handleStep1Submit = (data: {
    activity: string;
    event: string;
    eventId: string;
  }) => {
    const selectedEvent = events.find((e) => e.id.toString() === data.eventId);
    if (!selectedEvent) {
      setSubmissionError("Event nicht gefunden. Bitte versuchen Sie es erneut.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      ...data,
      eventDate: selectedEvent.date,
      eventAddress: selectedEvent.location?.address ?? "",
      locationName: selectedEvent.location?.name ?? "",
      discipline: selectedEvent.discipline,
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

    try {
      const response = await fetch("/api/register-trial-training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        setSubmissionError(
          `${errorData.error ?? "Anmeldung fehlgeschlagen. Bitte versuche es erneut."} Wenn das Problem weiterhin besteht, kontaktiere uns bitte per E‑Mail. munichtriathlonclub@gmail.com`,
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  };

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
          activities={activities}
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

  function handleBack() {
    setStep(step - 1);
  }
}

function convertEventDatesToLocal(eventsList: EventOption[]): EventOption[] {
  return eventsList.map((event) => ({
    ...event,
    date: convertUTCToLocalTime(event.date),
  }));
}
