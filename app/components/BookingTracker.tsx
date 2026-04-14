"use client";

import { useState, type FormEvent } from "react";
import type { Booking } from "../types";

export default function BookingTracker() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load bookings.");
      }
      setBookings(data);
      setStatus(data.length ? null : "No bookings found for this email.");
    } catch (error) {
      setStatus((error as Error).message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tracking" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Track your booking</p>
        <h2 className="text-3xl font-semibold text-slate-950">See your reservation status instantly.</h2>
        <p className="max-w-2xl text-slate-600">
          Enter the email you used during booking to view your current bookings and status updates.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Searching..." : "View status"}
        </button>
      </form>

      {status ? (
        <p className="mt-6 rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">{status}</p>
      ) : null}

      {bookings.length > 0 && (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-950">Booking #{booking.id}</p>
                  <p className="mt-1 text-sm text-slate-600">{booking.carName} · {booking.startDate} · {booking.days} days</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  booking.status === "Pending"
                    ? "bg-amber-100 text-amber-800"
                    : booking.status === "Approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {booking.status}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <p className="text-sm text-slate-700">Email: {booking.email}</p>
                <p className="text-sm text-slate-700">Total: ${booking.priceTotal}</p>
              </div>
              {booking.message ? <p className="mt-4 text-sm text-slate-600">Note: {booking.message}</p> : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
