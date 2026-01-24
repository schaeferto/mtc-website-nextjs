import Image from "next/image";
import logo from "../../public/logo-rounded.svg";

export default function Datenschutz() {
  return (
    <div
      className={"bg-mtc-background flex-col flex first-content items-center"}
    >
      <div className="text-mtc-black flex flex-col items-center max-w-4xl px-8">
        <div className={"mt-8 font-bold text-xl text-center"}>Datenschutzerklärung</div>
        <div className={"text-xl text-center"}>Munich Triathlon Club e.V.</div>

        <div className={"mt-8 text-left w-full space-y-6"}>
          <section>
            <h2 className="font-bold text-lg mb-2">1. Verantwortlicher</h2>
            <p>
              <strong>Munich Triathlon Club e.V.</strong><br />
              Vertreten durch den 1. Vorsitzenden: Valentin Müller<br />
              Schinkelstraße 43<br />
              80805 München<br />
              E-Mail: munichtriathlonclub@gmail.com
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">2. Art der verarbeiteten Daten</h2>
            <p>
              Wir verarbeiten personenbezogene Daten unserer Nutzer nur, soweit dies zur Bereitstellung
              einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">3. Server-Log-Dateien</h2>
            <p>
              Der Hosting-Provider dieser Website erhebt und speichert automatisch Informationen
              in sogenannten Server-Log-Dateien, die Ihr Browser automatisch übermittelt.
              Diese sind:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>IP-Adresse</li>
              <li>Browsertyp und -version</li>
              <li>Verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Uhrzeit der Serveranfrage</li>
            </ul>
            <p className="mt-2">
              Diese Daten sind nicht bestimmten Personen zuordenbar und werden nicht mit
              anderen Datenquellen zusammengeführt.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">4. Cookies</h2>
            <p>
              Diese Website verwendet keine Cookies zur Speicherung personenbezogener Daten.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">5. Anmeldung zum Probetraining</h2>
            <p>
              Wenn Sie sich über unser Online-Formular zum Probetraining anmelden, verarbeiten wir die
              von Ihnen eingegebenen Daten (Name, E-Mail-Adresse, Alter, gewählte Sportart und Termin).
            </p>
            <p className="mt-2">
              <strong>Zweck:</strong> Die Verarbeitung dieser Daten dient der Organisation und Durchführung
              des Probetrainings sowie der Kontaktaufnahme zur Übermittlung relevanter Informationen
              (z. B. der genauen Adresse des Trainingsorts).
            </p>
            <p className="mt-2">
              <strong>Rechtsgrundlage:</strong> Die Rechtsgrundlage für die Verarbeitung der Daten ist
              Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen).
            </p>
            <p className="mt-2">
              <strong>E-Mail-Versand (Resend):</strong> Für den technischen Versand von Bestätigungs- und
              Informations-E-Mails nutzen wir den Dienst „Resend“ (Resend, 2261 Market St #5039,
              San Francisco, CA 94114, USA). Hierbei werden Daten an Server in den USA übertragen.
              Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag (AVV / DPA) auf Grundlage der
              EU-Standardvertragsklauseln abgeschlossen, um ein angemessenes Datenschutzniveau zu gewährleisten.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">6. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung
              Ihrer gespeicherten personenbezogenen Daten. Bei Fragen zum Datenschutz können Sie sich
              jederzeit an uns wenden:
            </p>
            <p className="mt-2">
              E-Mail: munichtriathlonclub@gmail.com
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">7. Änderung der Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung zu ändern, um sie an geänderte
              Rechtslage oder bei Änderungen des Dienstes sowie der Datenverarbeitung anzupassen.
              Dies gilt jedoch nur im Hinblick auf Erklärungen zur Datenverarbeitung. Sofern
              Einwilligungen des Nutzers erforderlich sind oder Bestandteile der
              Datenschutzerklärung Regelungen des Vertragsverhältnisses mit den Nutzern enthalten,
              erfolgen die Änderungen nur mit Zustimmung der Nutzer.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">8. Stand der Datenschutzerklärung</h2>
            <p>
              Diese Datenschutzerklärung wurde zuletzt am 24.01.2026 aktualisiert.
            </p>
          </section>
        </div>
      </div>
      <Image width={120} src={logo} alt="Logo" className={"my-32"} />
    </div>
  );
}