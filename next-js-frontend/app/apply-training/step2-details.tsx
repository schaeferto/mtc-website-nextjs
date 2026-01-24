"use client";

import { useState } from "react";

interface Step2Props {
  formData: { activity: string; event: string; eventId: string };
  onSubmit: (data: { name: string; email: string; age: string }) => void;
  onBack: () => void;
}

export default function Step2Details({
  formData,
  onSubmit,
  onBack,
}: Step2Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !age || !privacy) {
      alert("Please fill in all fields and accept privacy policy");
      return;
    }

    setLoading(true);
    await onSubmit({ name, email, age });
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "6px",
              backgroundColor: "var(--mtc-yellow)",
              borderRadius: "3px",
            }}
          />
          <div
            style={{
              flex: 1,
              height: "6px",
              backgroundColor: "var(--mtc-yellow)",
              borderRadius: "3px",
            }}
          />
        </div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Deine Daten
        </h1>
        <p style={{ color: "#666", fontSize: "16px", textAlign: "center", marginBottom: "10px" }}>
          Fast geschafft! Gib uns noch kurz deine Kontaktdaten an.
        </p>
        <p style={{ color: "#666", fontSize: "14px", textAlign: "center", fontStyle: "italic" }}>
          Die genaue Adresse für das Training wird dir per E-Mail zugeschickt.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#555",
              textTransform: "uppercase",
            }}
          >
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vor- und Nachname"
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#f5f5f5",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#555",
              textTransform: "uppercase",
            }}
          >
            E-Mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="beispiel@mail.de"
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#f5f5f5",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#555",
              textTransform: "uppercase",
            }}
          >
            Alter
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Z.B. 25"
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#f5f5f5",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px", display: "flex", gap: "10px" }}>
          <input
            type="checkbox"
            id="privacy"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            style={{ marginTop: "2px" }}
          />
          <label
            htmlFor="privacy"
            style={{ fontSize: "13px", color: "#666", lineHeight: "1.4" }}
          >
            Ich akzeptiere die <a href="/datenschutz" target="_blank" style={{ textDecoration: "underline" }}>Datenschutzbestimmungen</a> und bin damit
            einverstanden, dass meine E-Mail-Adresse genutzt wird, um mir Informationen zum Probetraining zuzusenden.
          </label>
        </div>

        <div
          style={{ display: "flex", gap: "15px", flexDirection: "row-reverse" }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: "var(--mtc-yellow)",
              color: "#000",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "24px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {loading ? "Wird abgesendet..." : "Anmeldung abschicken"}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: "#e5e7eb",
              color: "#333",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "24px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Zurück
          </button>
        </div>
      </form>
    </main>
  );
}
