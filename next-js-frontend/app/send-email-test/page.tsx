"use client";

import { useState } from "react";

interface SendResult {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}

export default function SendEmailTestPage() {
  const [email, setEmail] = useState("tobias.schaefer.12@googlemail.com");
  const [subject, setSubject] = useState("Test Email from MTC Triathlon");
  const [html, setHtml] = useState(
    "<h1>Test Email</h1><p>This is a test email from your MTC Triathlon application.</p>",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, html }),
      });

      const data = await response.json();

      setResult({
        success: response.ok,
        message: response.ok
          ? "Email sent successfully!"
          : "Failed to send email",
        id: data.id,
        error: data.error,
      });
    } catch (error) {
      setResult({
        success: false,
        message: "Error sending email",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        marginTop: "80px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
      }}
    >
      <h1>Send Email Test</h1>

      <form
        onSubmit={handleSend}
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Recipient Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Subject:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            HTML Content:
          </label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            required
            rows={6}
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              fontFamily: "monospace",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: result.success ? "#d4edda" : "#f8d7da",
          }}
        >
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: result.success ? "green" : "red" }}>
              {result.success ? "✓ Success" : "✗ Failed"}
            </span>
          </p>
          <p>
            <strong>Message:</strong> {result.message}
          </p>
          {result.id && (
            <p>
              <strong>Email ID:</strong> {result.id}
            </p>
          )}
          {result.error && (
            <p>
              <strong>Error:</strong>{" "}
              {typeof result.error === "string"
                ? result.error
                : JSON.stringify(result.error)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
