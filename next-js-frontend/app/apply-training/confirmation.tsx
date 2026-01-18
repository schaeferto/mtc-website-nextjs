"use client";

export default function ConfirmationPage({ email }: { email: string }) {
  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <div style={{ fontSize: "60px", marginBottom: "20px" }}>✅</div>
        <h1
          style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "15px" }}
        >
          Anmeldung erfolgreich!
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: "16px",
            marginBottom: "20px",
            lineHeight: "1.6",
          }}
        >
          Vielen Dank für deine Anmeldung zum Probetraining. Du erhältst in
          Kürze eine Bestätigungsemail an:
        </p>
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "30px",
            wordBreak: "break-all",
          }}
        >
          {email}
        </div>

        <p style={{ color: "#666", fontSize: "14px", marginBottom: "30px" }}>
          Wir freuen uns auf dich! Bei Fragen melde dich gerne bei uns.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: "#fde047",
            color: "#000",
            padding: "12px 40px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "24px",
            textDecoration: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Zur Startseite
        </a>
      </div>
    </main>
  );
}
