import type { Car } from "./types";
import { getAvailableCars } from "./lib/db";
import BookingPanel from "./components/BookingPanel";
import FleetSection from "./components/FleetSection";
import FeaturesSection from "./components/FeaturesSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cars = await getAvailableCars();

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
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

          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-white/10">
            <div className="space-y-4">
              <p className="uppercase tracking-[0.32em] text-cyan-300">Reserve your ride</p>
              <h2 className="text-3xl font-semibold">Book a premium car in just a few steps.</h2>
              <p className="text-slate-300">Tell us about your trip, choose the perfect vehicle, and we’ll secure your booking right away.</p>
            </div>

            <div className="mt-10 rounded-[2rem] bg-slate-900/95 p-6 ring-1 ring-slate-700/50">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Featured vehicle</p>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-white">{cars[0]?.brand} {cars[0]?.model}</p>
                  <p className="text-sm text-slate-400">{cars[0]?.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="rounded-full bg-white/10 px-3 py-1">${cars[0]?.pricePerDay}/day</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{cars[0]?.year}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{cars[0]?.seats} seats</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-16 grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <FleetSection cars={cars} />
            <FeaturesSection />
          </div>
          <BookingPanel cars={cars} />
        </div>
      </div>
    </main>
  );
}
