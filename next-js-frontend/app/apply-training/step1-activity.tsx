"use client";

import { useState } from "react";
import { PiPersonSimpleSwimLight, PiPersonSimpleRunLight, PiMapPinLight } from "react-icons/pi";
import Image from "next/image";

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
        <p style={{ color: "#666", fontSize: "14px", marginTop: "10px", fontStyle: "italic" }}>
          Die genaue Adresse für das Training wird dir per E-Mail zugeschickt.
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
                  border: "2px solid var(--mtc-yellow)",
                  borderRadius: "8px",
                  textAlign: "center",
                  transition: "all 0.2s",
                  backgroundColor:
                    selectedActivity === training.documentId
                      ? "#fef3c7"
                      : "#fff",
                  borderColor:
                    selectedActivity === training.documentId
                      ? "var(--mtc-yellow)"
                      : "var(--mtc-background)",
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
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {training.title === "Swimming" ||
                    training.title === "Schwimmen" ? (
                    <PiPersonSimpleSwimLight
                      style={{
                        transform:
                          selectedActivity === training.documentId
                            ? "scale(1.1)"
                            : "scale(1)",
                        transition: "transform 0.2s",
                      }}
                    />
                  ) : (
                    <PiPersonSimpleRunLight
                      style={{
                        transform:
                          selectedActivity === training.documentId
                            ? "scale(1.1)"
                            : "scale(1)",
                        transition: "transform 0.2s",
                      }}
                    />
                  )}
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
                borderBottom: "2px solid var(--mtc-yellow)",
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

        {selectedActivity && selectedEvent && (
          <div
            style={{
              animation: "fadeIn 0.5s ease-in",
              marginBottom: "30px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              border: "1px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "15px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              <PiMapPinLight size={24} />
              <span>
                Trainingsort:{" "}
                {events.find((e) => e.documentId === selectedEvent)?.location
                  ?.name || "Unbekannt"}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "250px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                textAlign: "center",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {events.find((e) => e.documentId === selectedEvent)?.location
                ?.imageName ? (
                <Image
                  src={`/${events.find((e) => e.documentId === selectedEvent)?.location
                    ?.imageName
                    }`}
                  alt="Training Location"
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized // Since it's a dynamic image name from public/ folder
                />
              ) : (
                <>
                  <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                    Hier wird die Karte angezeigt, sobald die Location in Strapi
                    konfiguriert wurde.
                  </p>
                  <p style={{ fontSize: "12px", color: "#999" }}>
                    Keine Location für diesen Termin hinterlegt.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            type="submit"
            disabled={!selectedActivity || !selectedEvent}
            style={{
              backgroundColor:
                selectedActivity && selectedEvent ? "var(--mtc-yellow)" : "#ccc",
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
              backgroundColor: "var(--mtc-yellow)",
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
