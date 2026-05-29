"use client";

import { useState, useEffect } from "react";
import {
  PiPersonSimpleSwimLight,
  PiPersonSimpleRunLight,
  PiMapPinLight,
  PiWarningLight,
} from "react-icons/pi";
import Image from "next/image";

export interface EventOption {
  id: number;
  date: string;
  discipline: "Schwimmen" | "Laufen";
  location: {
    id: number;
    name: string;
    address?: string | null;
    image?: { url?: string | null } | null;
  } | null;
}

export interface ActivityOption {
  value: "Schwimmen" | "Laufen";
  title: string;
}

interface Step1Props {
  activities: ActivityOption[];
  events: EventOption[];
  formData: { activity: string; event: string; eventId: string };
  onSubmit: (data: {
    activity: string;
    event: string;
    eventId: string;
  }) => void;
}

export default function Step1Activity({
  activities,
  events,
  formData,
  onSubmit,
}: Step1Props) {
  const [selectedActivity, setSelectedActivity] = useState(formData.activity);
  const [selectedEvent, setSelectedEvent] = useState(formData.eventId);

  useEffect(() => {
    setSelectedActivity(formData.activity);
    setSelectedEvent(formData.eventId);
  }, [formData.activity, formData.eventId]);

  const filteredEvents = selectedActivity
    ? events.filter((e) => e.discipline === selectedActivity)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !selectedEvent) {
      alert("Please select both activity and date");
      return;
    }
    onSubmit({
      activity: selectedActivity,
      event: selectedActivity,
      eventId: selectedEvent,
    });
  };

  const selectedEventData = events.find(
    (e) => e.id.toString() === selectedEvent,
  );

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
        <p
          style={{
            color: "#666",
            fontSize: "14px",
            marginTop: "10px",
            fontStyle: "italic",
          }}
        >
          Die genaue Adresse für das Training wird dir per E-Mail zugeschickt.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {activities.map((activity) => (
              <label
                key={activity.value}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  padding: "16px",
                  border: "2px solid",
                  borderRadius: "16px",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  backgroundColor:
                    selectedActivity === activity.value ? "#fef3c7" : "#fff",
                  borderColor:
                    selectedActivity === activity.value
                      ? "var(--mtc-yellow)"
                      : "#e5e7eb",
                }}
              >
                <input
                  type="radio"
                  name="activity"
                  value={activity.value}
                  checked={selectedActivity === activity.value}
                  onChange={(e) => {
                    setSelectedActivity(e.target.value);
                    setSelectedEvent("");
                  }}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor:
                      selectedActivity === activity.value
                        ? "var(--mtc-yellow)"
                        : "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color:
                      selectedActivity === activity.value ? "#000" : "#6b7280",
                    fontSize: "28px",
                  }}
                >
                  {activity.title === "Schwimmen" ? (
                    <PiPersonSimpleSwimLight size={28} />
                  ) : (
                    <PiPersonSimpleRunLight size={28} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {activity.title}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginTop: "2px",
                    }}
                  >
                    {activity.title === "Schwimmen"
                      ? "Schwimmtraining im 25m Becken"
                      : "Intervalltraining im Park oder auf der Bahn"}
                  </div>
                </div>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor:
                      selectedActivity === activity.value
                        ? "var(--mtc-yellow)"
                        : "#d1d5db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {selectedActivity === activity.value && (
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "var(--mtc-yellow)",
                      }}
                    />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {selectedActivity === "Schwimmen" && (
          <div
            style={{
              marginBottom: "30px",
              padding: "16px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              display: "flex",
              gap: "12px",
            }}
          >
            <PiWarningLight
              size={24}
              style={{ color: "#991b1b", flexShrink: 0 }}
            />
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  color: "#991b1b",
                }}
              >
                Hinweis:
              </div>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  margin: 0,
                  color: "#991b1b",
                }}
              >
                Du solltest in der Lage sein, 400m in unter 10 Minuten
                durchgängig zu kraulen.
              </p>
            </div>
          </div>
        )}

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
                <option key={event.id} value={event.id.toString()}>
                  {event.date}
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
                {selectedEventData?.location?.name || "Unbekannt"}
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
              {selectedEventData?.location?.image?.url ? (
                <Image
                  src={selectedEventData.location.image.url}
                  alt="Training Location"
                  fill
                  sizes="(max-width: 800px) 100vw, 800px"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <>
                  <p style={{ fontSize: "14px", marginBottom: "10px" }}>
                    Kein Bild für diesen Trainingsort hinterlegt.
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
                selectedActivity && selectedEvent
                  ? "var(--mtc-yellow)"
                  : "#ccc",
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
