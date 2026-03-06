export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">

        {/* Left */}
        <div className="text-sm text-center md:text-left">
          <div className="font-semibold text-slate-200">
            Assembly Line Maintenance
          </div>
          <div>Demo Full-Stack Project</div>
        </div>

        {/* Center */}
        <div className="text-xs text-slate-500">
          React • React Three Fiber • Tailwind • Express • PostgreSQL <br/>
          Offline Drafts via IndexedDB (Dexie)
        </div>

        {/* Right */}
        <div className="flex gap-4 text-sm">
          <a href="https://github.com/Juraj-F/project_maintenance.git" target="_blank" className="hover:text-white">
            GitHub
          </a>
          <a href="mailto:jurajfarsky@gmail.com" className="hover:text-white">
            Contact
          </a>
        </div>

      </div>
    </footer>
  );
}