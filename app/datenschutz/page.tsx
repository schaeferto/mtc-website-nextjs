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
              Diese Website ist eine rein statische Webseite. Es werden keine personenbezogenen 
              Daten durch uns erhoben, verarbeitet oder gespeichert.
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
            <h2 className="font-bold text-lg mb-2">5. Ihre Rechte</h2>
            <p>
              Da wir keine personenbezogenen Daten erheben, gibt es keine zu löschenden oder 
              zu korrigierenden Daten. Sollten Sie dennoch Fragen zum Datenschutz haben, 
              können Sie sich jederzeit an uns wenden:
            </p>
            <p className="mt-2">
              E-Mail: munichtriathlonclub@gmail.com
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2">6. Änderung der Datenschutzerklärung</h2>
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
            <h2 className="font-bold text-lg mb-2">7. Stand der Datenschutzerklärung</h2>
            <p>
              Diese Datenschutzerklärung wurde zuletzt am 17.09.2025 aktualisiert.
            </p>
          </section>
        </div>
      </div>
      <Image width={120} src={logo} alt="Logo" className={"my-32"} />
    </div>
  );
}