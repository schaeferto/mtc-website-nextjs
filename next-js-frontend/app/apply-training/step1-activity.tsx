"use client";

import { useState } from "react";

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

interface Step1Props {
  trainings: TrainingOption[];
  events: EventOption[];
  formData: { activity: string; event: string; eventId: string };
  onSubmit: (data: {
    activity: string;
    event: string;
    eventId: string;
  }) => void;
}

export default function Step1Activity({
  trainings,
  events,
  formData,
  onSubmit,
}: Step1Props) {
  const [selectedActivity, setSelectedActivity] = useState(formData.activity);
  const [selectedEvent, setSelectedEvent] = useState(formData.eventId);

  const filteredEvents = selectedActivity
    ? events.filter((e) => e.training.documentId === selectedActivity)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !selectedEvent) {
      alert("Please select both activity and date");
      return;
    }
    onSubmit({
      activity: selectedActivity,
      event:
        filteredEvents.find((e) => e.documentId === selectedEvent)?.training
          .title || "",
      eventId: selectedEvent,
    });
  };

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}
        >
          Probetraining buchen
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Schritt 1: Sportart und Termin wählen
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {trainings.map((training) => (
              <label
                key={training.documentId}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  padding: "20px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  textAlign: "center",
                  transition: "all 0.2s",
                  backgroundColor:
                    selectedActivity === training.documentId
                      ? "#fef3c7"
                      : "#fff",
                  borderColor:
                    selectedActivity === training.documentId
                      ? "#fde047"
                      : "#ddd",
                }}
              >
                <input
                  type="radio"
                  name="activity"
                  value={training.documentId}
                  checked={selectedActivity === training.documentId}
                  onChange={(e) => {
                    setSelectedActivity(e.target.value);
                    setSelectedEvent("");
                  }}
                  style={{ display: "none" }}
                />
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                  {training.title === "Swimming" ||
                  training.title === "Schwimmen"
                    ? "🏊"
                    : "🏃"}
                </div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {training.title}
                </div>
              </label>
            ))}
          </div>
        </div>

        {selectedActivity && (
          <div
            style={{
              animation: "fadeIn 0.3s ease-in",
              marginBottom: "30px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Termin wählen
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderBottom: "2px solid #fde047",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              <option value="">Verfügbaren Termin auswählen...</option>
              {filteredEvents.map((event) => (
                <option key={event.documentId} value={event.documentId}>
                  {new Date(event.date).toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            type="submit"
            disabled={!selectedActivity || !selectedEvent}
            style={{
              backgroundColor:
                selectedActivity && selectedEvent ? "#fde047" : "#ccc",
              color: "#000",
              padding: "12px 40px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "24px",
              cursor:
                selectedActivity && selectedEvent ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            Weiter
          </button>
        </div>
      </form>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#fde047",
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ddd",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
