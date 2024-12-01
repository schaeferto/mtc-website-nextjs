import "../globals.css";

export default function Join() {
  return (
    <div className={"first-content px-12 pt-12"}>
      <h1 className={"text-2xl font-bold text-center mb-8"}>MITGLIED WERDEN</h1>
      <div className={"flex flex-col gap-8"}>
        <p>
          Du bist auf der Suche nach einem Triathlon-Verein und möchtest uns
          einmal kennen lernen? Na klar! Schreib uns einfach eine E-Mail und wir
          vereinbaren alles weitere. Wir freuen uns auf dich!
        </p>
        <div className={"flex flex-col"}>
          <p>Munich Triathlon Club e.V.</p>
          <p>Schinkelstraße 43</p>
          <p>80805 München</p>
        </div>
        <div>
          <b>E-Mail</b>:<p>munichtriathlonclub@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
