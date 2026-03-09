"use client";

import { useState, useEffect } from "react";

interface Step2Props {
  formData: {
    activity: string;
    event: string;
    eventId: string;
    name?: string;
    email?: string;
    over18?: boolean;
  };
  onSubmit: (data: { name: string; email: string; over18: boolean }) => void;
  onBack: () => void;
  onChange: (data: { name?: string; email?: string; over18?: boolean }) => void;
}

export default function Step2Details({
  formData,
  onSubmit,
  onBack,
  onChange,
}: Step2Props) {
  // sync local fields when parent formData changes (e.g. returning)
  useEffect(() => {
    if (formData.name !== undefined) setName(formData.name);
    if (formData.email !== undefined) setEmail(formData.email);
    if (formData.over18 !== undefined) setOver18(formData.over18);
  }, [formData.name, formData.email, formData.over18]);
  const [name, setName] = useState(formData.name || "");
  const [email, setEmail] = useState(formData.email || "");
  const [over18, setOver18] = useState(Boolean(formData.over18));
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !privacy || !over18) {
      alert(
        "Bitte alle Felder ausfüllen, die Datenschutzerklärung akzeptieren und bestätigen, dass du über 18 bist.",
      );
      return;
    }

    setLoading(true);
    await onSubmit({ name, email, over18 });
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
        <p style={{ color: "#666", fontSize: "16px", textAlign: "center" }}>
          Fast geschafft! Gib uns noch kurz deine Kontaktdaten an.
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
            onChange={(e) => {
              setName(e.target.value);
              onChange({ name: e.target.value });
            }}
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
            onChange={(e) => {
              setEmail(e.target.value);
              onChange({ email: e.target.value });
            }}
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

        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <input
            type="checkbox"
            id="over18"
            checked={over18}
            onChange={(e) => {
              setOver18(e.target.checked);
              onChange({ over18: e.target.checked });
            }}
            style={{ marginTop: "2px" }}
          />
          <label
            htmlFor="over18"
            style={{ fontSize: "13px", color: "#666", lineHeight: "1.4" }}
          >
            Ich bin über 18 Jahre alt
          </label>
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
            Ich akzeptiere die{" "}
            <a
              href="/datenschutz"
              target="_blank"
              style={{ textDecoration: "underline" }}
            >
              Datenschutzbestimmungen
            </a>{" "}
            und bin damit einverstanden, dass meine E-Mail-Adresse genutzt wird,
            um mir Informationen zum Probetraining zuzusenden.
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
