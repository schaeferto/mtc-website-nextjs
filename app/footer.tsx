export default function Footer() {
  return (
    <footer className={`bg-mtc-black`}>
      <div className="flex flex-col justify-center items-center text-sm gap-4 py-6">
        <span>Impressum</span>
        <div>© 2024 Munich Triathlon Club e.V.</div>
        <div className="flex flex-col items-center justify-center">
          <div>Made with ❤️ by</div>
          <div>
            <i className="fa-brands fa-github pr-2 text-zinc-500"></i>
            <a href="https://github.com/schaeferto" target="_blank">
              schaeferto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
