export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-700">Car Rental</p>
          <p className="text-base font-medium text-slate-900">Premium rentals with live booking status.</p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600 sm:gap-5">
          <a href="#fleet" className="transition hover:text-slate-900">Fleet</a>
          <a href="#book" className="transition hover:text-slate-900">Book now</a>
          <a href="#tracking" className="transition hover:text-slate-900">Track booking</a>
          <a href="#dashboard" className="transition hover:text-slate-900">User dashboard</a>
          <a href="#admin" className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-slate-300 hover:text-slate-950">
            Admin access
          </a>
        </nav>
      </div>
    </header>
  );
}
