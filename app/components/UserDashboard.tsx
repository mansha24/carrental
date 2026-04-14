"use client";

import { useEffect, useMemo, useState } from "react";
import type { Car, Booking, Notification, User } from "../types";

type UserDashboardProps = {
  user: User;
};

export default function UserDashboard({ user }: UserDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [bookingsResponse, notificationsResponse, carsResponse] = await Promise.all([
          fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`),
          fetch("/api/notifications"),
          fetch("/api/cars"),
        ]);

        const [bookingsData, notificationsData, carsData] = await Promise.all([
          bookingsResponse.json(),
          notificationsResponse.json(),
          carsResponse.json(),
        ]);

        if (!bookingsResponse.ok) throw new Error(bookingsData.error || "Unable to load bookings.");
        if (!notificationsResponse.ok) throw new Error(notificationsData.error || "Unable to load notifications.");
        if (!carsResponse.ok) throw new Error(carsData.error || "Unable to load cars.");

        setBookings(bookingsData);
        setNotifications(notificationsData);
        setCars(carsData);
      } catch (error) {
        setStatusMessage((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.email]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(cars.map((car) => car.category)))], [cars]);
  const visibleCars = selectedCategory === "All" ? cars : cars.filter((car) => car.category === selectedCategory);

  const handleMarkRead = async (notificationId: number) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notificationId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to mark notification as read.");
      setNotifications((current) => current.map((note) => (note.id === data.id ? { ...note, read: true } : note)));
    } catch (error) {
      setStatusMessage((error as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Welcome back</p>
            <h1 className="text-4xl font-semibold text-slate-950">Hello, {user.name}.</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Your user dashboard shows bookings, notifications, and every available car category you can browse.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-cyan-200 bg-cyan-50 px-6 py-5 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-700">Role</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{user.role}</p>
          </div>
        </div>
      </section>

      {statusMessage ? (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700">
          {statusMessage}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Notifications</p>
              <h2 className="text-3xl font-semibold text-slate-950">Latest updates</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {notifications.filter((note) => !note.read).length} unread
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {notifications.length === 0 ? (
              <p className="text-slate-600">No notifications yet. Check back after admin updates your bookings or adds a new vehicle.</p>
            ) : (
              notifications.map((notification) => (
                <article
                  key={notification.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-950">{notification.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        notification.read ? "bg-slate-200 text-slate-700" : "bg-cyan-100 text-cyan-800"
                      }`}
                    >
                      {notification.read ? "Read" : "New"}
                    </span>
                  </div>
                  {!notification.read ? (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(notification.id)}
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Mark as read
                    </button>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Browse cars</p>
            <h2 className="text-3xl font-semibold text-slate-950">Pick the right category</h2>
            <p className="text-slate-600">Filter our available fleet by vehicle type and explore the best ride for your next trip.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "bg-cyan-600 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {visibleCars.length === 0 ? (
              <p className="text-slate-600">No cars found in that category. Try a different filter or return to the booking page.</p>
            ) : (
              visibleCars.map((car) => (
                <article key={car.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{car.brand} {car.model}</p>
                      <p className="mt-1 text-sm text-slate-600">{car.category} · {car.year} · {car.seats} seats</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-800">${car.pricePerDay}/day</span>
                      <a
                        href="/#book"
                        className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                      >
                        Book now
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Your bookings</p>
            <h2 className="text-3xl font-semibold text-slate-950">Recent reservation history</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{bookings.length} bookings</span>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <p className="text-slate-600">Loading your bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-slate-600">No bookings found. Reserve a car above and check your email later for status updates.</p>
          ) : (
            bookings.map((booking) => (
              <article key={booking.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Booking #{booking.id}</p>
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
                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
                  <p>Email: {booking.email}</p>
                  <p>Total: ${booking.priceTotal}</p>
                </div>
                {booking.message ? <p className="mt-4 text-sm text-slate-600">Note: {booking.message}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
