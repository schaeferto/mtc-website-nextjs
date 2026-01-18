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
}

interface FormData {
  activity: string;
  event: string;
  eventId: string;
  name: string;
  email: string;
  age: string;
}

export default function ApplyTrainingPage() {
  const [step, setStep] = useState(1);
  const [trainings, setTrainings] = useState<TrainingOption[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    activity: "",
    event: "",
    eventId: "",
    name: "",
    email: "",
    age: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTrainingsAndEvents();
  }, []);

  const fetchTrainingsAndEvents = async () => {
    try {
      setLoading(true);
      const [trainingsRes, eventsRes] = await Promise.all([
        fetch("/api/training-options"),
        fetch("/api/event-options"),
      ]);

      const trainingsData = await trainingsRes.json();
      const eventsData = await eventsRes.json();

      setTrainings(trainingsData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching trainings/events:", error);
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
    age: string;
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
      <div style={{ padding: "20px", marginTop: "80px", textAlign: "center" }}>
        <p>Loading training options...</p>
      </div>
    );
  }

  if (submitted) {
    return <ConfirmationPage email={formData.email} />;
  }

  return (
    <div style={{ marginTop: "80px" }}>
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
        />
      )}
    </div>
  );
}
