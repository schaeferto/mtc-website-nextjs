"use client";

import { useState, useEffect } from "react";
import "../globals.css";

interface ConnectionResult {
  success: boolean;
  message: string;
  url?: string;
}

export default function StrapiTestPage() {
  const [result, setResult] = useState<ConnectionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-strapi");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className={"first-content"}>
      <h1>Strapi Connection Test</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: result?.success ? "#d4edda" : "#f8d7da",
        }}
      >
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: result?.success ? "green" : "red" }}>
            {result?.success ? "✓ Connected" : "✗ Failed"}
          </span>
        </p>
        <p>
          <strong>Message:</strong> {result?.message}
        </p>
        {result?.url && (
          <p>
            <strong>URL:</strong> {result.url}
          </p>
        )}
      </div>

      <button
        onClick={testConnection}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>
    </div>
  );
}
