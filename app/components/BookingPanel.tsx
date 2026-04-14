"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Car } from "../types";

type BookingPanelProps = {
  cars: Car[];
};

export default function BookingPanel({ cars }: BookingPanelProps) {
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id ?? 0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState(3);
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [latestBookingId, setLatestBookingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCar = useMemo(
    () => cars.find((car) => car.id === selectedCarId),
    [cars, selectedCarId]
  );

  const totalPrice = selectedCar ? selectedCar.pricePerDay * days : 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const payload = {
      name,
      email,
      phone,
      carId: selectedCarId,
      startDate,
      days,
      message,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to place booking.");
      }

      setLatestBookingId(result.booking?.id ?? null);
      setStatusMessage(
        `Your booking was submitted successfully. Use the tracker below with your email to check status. Booking #${result.booking?.id}`
      );
      setName("");
      setEmail("");
      setPhone("");
      setDays(3);
      setMessage("");
    } catch (error) {
      setStatusMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-white/10 sm:px-10">
      <div className="mb-10 space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Book now</p>
        <h2 className="text-3xl font-semibold sm:text-4xl">Reserve your car in minutes.</h2>
        <p className="max-w-2xl text-slate-300">
          Choose from our available fleet, confirm your dates, and get instant booking confirmation with a PostgreSQL-backed rental service.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-200">
            Full name
            <input
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Martin"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Email address
            <input
              type="email"
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="alex@example.com"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-200">
            Phone number
            <input
              type="tel"
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Pick a car
            <select
              value={selectedCarId}
              onChange={(event) => setSelectedCarId(Number(event.target.value))}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            >
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.category})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-medium text-slate-200">
            Start date
            <input
              type="date"
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Rental days
            <input
              type="number"
              min={1}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              required
            />
          </label>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">Estimated total</p>
            <p className="mt-3 text-2xl font-semibold text-cyan-300">${totalPrice}</p>
            <p className="mt-1 text-slate-400">{selectedCar?.brand} {selectedCar?.model}</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-slate-200">
          Notes for our team
          <textarea
            className="mt-2 min-h-[100px] w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell us about your trip or special requests"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Confirm booking"}
          </button>

          {statusMessage ? (
            <p className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-200 ring-1 ring-slate-700">
              {statusMessage}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
