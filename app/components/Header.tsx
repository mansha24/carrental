import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl transition-shadow duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-700">Car Rental</p>
          <p className="text-base font-medium text-slate-900">Premium rentals with live booking status.</p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600 sm:gap-5">
          <Link
            href="/"
            className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-cyan-700 transition-transform duration-500 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-100 animate-float"
          >
            Home
          </Link>
          <Link href="#fleet" className="transition hover:text-slate-900">
            Fleet
          </Link>
          <Link href="#book" className="transition hover:text-slate-900">
            Book now
          </Link>
          <Link href="/user-dashboard" className="transition hover:text-slate-900">
            User portal
          </Link>
          <Link href="/login" className="transition hover:text-slate-900">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
