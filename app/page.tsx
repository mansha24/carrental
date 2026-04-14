import type { Car } from "./types";
import { getAvailableCars } from "./lib/db";
import Header from "./components/Header";
import BookingPanel from "./components/BookingPanel";
import FleetSection from "./components/FleetSection";
import FeaturesSection from "./components/FeaturesSection";
import HeroCarousel from "./components/HeroCarousel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cars = await getAvailableCars();

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800">
              Car rentals powered by PostgreSQL
            </div>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Premium mobility</p>
              <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Drive the perfect vehicle for every trip.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A modern car rental website with fleet discovery, instant reservations, and secure backend persistence using your Neon PostgreSQL database.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Fast booking</p>
                <p className="mt-3 text-slate-700">Choose a car, select rental dates, and confirm your reservation in seconds.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Safe rental</p>
                <p className="mt-3 text-slate-700">Reservations are stored securely in PostgreSQL and managed through API routes.</p>
              </div>
            </div>
          </div>

          <HeroCarousel cars={cars} />
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/#book"
              className="glow-button inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition duration-300 hover:-translate-y-1 hover:bg-cyan-400"
            >
              Book a car now
            </a>
            <a
              href="/user-dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition duration-300 hover:border-white hover:bg-white/20"
            >
              Explore dashboard
            </a>
          </div>
        </section>

        <div className="mt-16 grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <section id="fleet" className="space-y-10">
              <FleetSection cars={cars} />
              <FeaturesSection />
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Dashboard access</p>
                <h2 className="text-3xl font-semibold text-slate-950">Separate pages for user and admin dashboards.</h2>
                <p className="max-w-2xl text-slate-600">
                  Manage your reservation status on the user dashboard or approve bookings through the dedicated admin panel.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <a
                  href="/user-dashboard"
                  className="inline-flex items-center justify-center rounded-3xl border border-cyan-200 bg-cyan-50 px-6 py-4 text-center text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
                >
                  Go to User Dashboard
                </a>
                <a
                  href="/admin-dashboard"
                  className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-6 py-4 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Go to Admin Dashboard
                </a>
              </div>
            </section>
          </div>

          <div className="space-y-10">
            <section id="book">
              <BookingPanel cars={cars} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
