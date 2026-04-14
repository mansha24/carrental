"use client";

import { useEffect, useState } from "react";
import type { Booking } from "../types";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch("/api/bookings?status=Pending");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load pending bookings.");
      setBookings(data);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const updateStatus = async (bookingId: number, statusValue: string) => {
    setActionLoading(bookingId);
    setStatus(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: statusValue }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update booking.");
      setBookings((current) => current.filter((booking) => booking.id !== bookingId));
      setStatus(`Booking #${bookingId} marked ${statusValue}.`);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section id="admin" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Admin dashboard</p>
        <h2 className="text-3xl font-semibold text-slate-950">Manage pending bookings.</h2>
        <p className="max-w-2xl text-slate-600">
          This dashboard lets an admin review incoming reservations and approve or decline them in real time.
        </p>
      </div>

      {status ? <p className="mt-6 rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">{status}</p> : null}

      {loading ? (
        <div className="mt-8 text-sm text-slate-600">Loading pending bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-600">
          No pending bookings at the moment.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">Booking #{booking.id}</p>
                  <p className="text-sm text-slate-600">{booking.carName} · {booking.startDate} · {booking.days} days</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">{booking.status}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
                <p>Email: {booking.email}</p>
                <p>Phone: {booking.phone}</p>
              </div>
              {booking.message ? <p className="mt-4 text-sm text-slate-600">Note: {booking.message}</p> : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={actionLoading === booking.id}
                  onClick={() => updateStatus(booking.id, "Approved")}
                  className="rounded-3xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={actionLoading === booking.id}
                  onClick={() => updateStatus(booking.id, "Declined")}
                  className="rounded-3xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
