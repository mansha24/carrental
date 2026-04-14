"use client";

import { useEffect, useState } from "react";
import type { Booking, User } from "../types";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<"user" | "admin">("user");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [carForm, setCarForm] = useState({
    brand: "",
    model: "",
    year: 2025,
    condition: "Excellent",
    pricePerDay: 95,
    seats: 4,
    image: "",
    description: "",
    category: "Sedan",
  });

  const fetchPending = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const [bookingsResponse, usersResponse] = await Promise.all([
        fetch("/api/bookings?status=Pending"),
        fetch("/api/users"),
      ]);
      const [bookingsData, usersData] = await Promise.all([
        bookingsResponse.json(),
        usersResponse.json(),
      ]);

      if (!bookingsResponse.ok) throw new Error(bookingsData.error || "Unable to load pending bookings.");
      if (!usersResponse.ok) throw new Error(usersData.error || "Unable to load users.");

      setBookings(bookingsData);
      setUsers(usersData);
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

  const handleSendNotification = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notificationEmail, title: notificationTitle, message: notificationMessage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send notification.");
      setNotificationEmail("");
      setNotificationTitle("");
      setNotificationMessage("");
      setStatus(`Notification sent to ${data.notification.userId}.`);
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const handleAssignRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: selectedUserEmail, role: selectedRole }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update role.");
      setStatus(`Assigned ${selectedRole} to ${data.user.email}.`);
      fetchPending();
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          password: createPassword,
          role: createRole,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create user.");
      setCreateName("");
      setCreateEmail("");
      setCreatePassword("");
      setCreateRole("user");
      setStatus(`Created ${data.user.role} account for ${data.user.email}.`);
      fetchPending();
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const handleAddCar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...carForm, available: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to add car.");
      setCarForm({
        brand: "",
        model: "",
        year: 2025,
        condition: "Excellent",
        pricePerDay: 95,
        seats: 4,
        image: "",
        description: "",
        category: "Sedan",
      });
      setStatus(`Car ${data.car.brand} ${data.car.model} created successfully.`);
      fetchPending();
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Admin dashboard</p>
            <h2 className="text-3xl font-semibold text-slate-950">Approve bookings and manage users.</h2>
            <p className="max-w-3xl text-slate-600">
              Review pending reservations, add new cars, assign roles, and send notifications directly to users.
            </p>
          </div>
          <div className="rounded-full bg-cyan-50 px-5 py-4 text-sm font-semibold text-cyan-700">
            Admin controls
          </div>
        </div>
      </section>

      {status ? (
        <div className="rounded-[1.75rem] border border-cyan-200 bg-cyan-50 px-6 py-4 text-sm text-cyan-800">
          {status}
        </div>
      ) : null}

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Pending bookings</p>
                <h3 className="text-2xl font-semibold text-slate-950">Review incoming reservations</h3>
              </div>
              <button
                type="button"
                onClick={fetchPending}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="mt-6 text-slate-600">Loading pending bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-600">
                No pending bookings at the moment.
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {bookings.map((booking) => (
                  <article key={booking.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
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
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">User management</p>
              <h3 className="text-2xl font-semibold text-slate-950">Create users and manage roles</h3>
              <p className="text-slate-600">Create user accounts directly from the admin dashboard and assign them the correct role.</p>
            </div>

            <form onSubmit={handleCreateUser} className="mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  placeholder="Full name"
                  value={createName}
                  onChange={(event) => setCreateName(event.target.value)}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={createEmail}
                  onChange={(event) => setCreateEmail(event.target.value)}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="password"
                  placeholder="Password"
                  value={createPassword}
                  onChange={(event) => setCreatePassword(event.target.value)}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
                <select
                  value={createRole}
                  onChange={(event) => setCreateRole(event.target.value as "user" | "admin")}
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-3xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Create user account
              </button>
            </form>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-700">Update existing user role</p>
              <form onSubmit={handleAssignRole} className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={selectedUserEmail}
                    onChange={(event) => setSelectedUserEmail(event.target.value)}
                    required
                    className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <select
                    value={selectedRole}
                    onChange={(event) => setSelectedRole(event.target.value as "user" | "admin")}
                    className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Update role
                </button>
              </form>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-700">Current users</p>
              <div className="mt-6 space-y-3">
                {users.map((userItem) => (
                  <div key={userItem.id} className="rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-slate-950">{userItem.name} ({userItem.email})</p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{userItem.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Send notification</p>
              <h3 className="text-2xl font-semibold text-slate-950">Let your users know instantly</h3>
              <p className="text-slate-600">Send alerts and booking updates directly to a user dashboard notification stream.</p>
            </div>

            <form onSubmit={handleSendNotification} className="mt-8 grid gap-4">
              <input
                type="email"
                placeholder="user@example.com"
                value={notificationEmail}
                onChange={(event) => setNotificationEmail(event.target.value)}
                required
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <input
                type="text"
                placeholder="Notification title"
                value={notificationTitle}
                onChange={(event) => setNotificationTitle(event.target.value)}
                required
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <textarea
                rows={5}
                placeholder="Write your message here"
                value={notificationMessage}
                onChange={(event) => setNotificationMessage(event.target.value)}
                required
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-3xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Send notification
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Add a new car</p>
              <h3 className="text-2xl font-semibold text-slate-950">Create fresh listings</h3>
              <p className="text-slate-600">Add vehicles to your fleet quickly and make them available to users immediately.</p>
            </div>

            <form onSubmit={handleAddCar} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  placeholder="Brand"
                  value={carForm.brand}
                  onChange={(event) => setCarForm((prev) => ({ ...prev, brand: event.target.value }))}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
                <input
                  placeholder="Model"
                  value={carForm.model}
                  onChange={(event) => setCarForm((prev) => ({ ...prev, model: event.target.value }))}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="number"
                  min={2000}
                  value={carForm.year}
                  onChange={(event) => setCarForm((prev) => ({ ...prev, year: Number(event.target.value) }))}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Year"
                />
                <input
                  placeholder="Condition"
                  value={carForm.condition}
                  onChange={(event) => setCarForm((prev) => ({ ...prev, condition: event.target.value }))}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
                <input
                  type="number"
                  min={1}
                  value={carForm.pricePerDay}
                  onChange={(event) => setCarForm((prev) => ({ ...prev, pricePerDay: Number(event.target.value) }))}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Price"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  min={1}
                  value={carForm.seats}
                  onChange={(event) => setCarForm((prev) => ({ ...prev, seats: Number(event.target.value) }))}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Seats"
                />
                <input
                  placeholder="Category"
                  value={carForm.category}
                  onChange={(event) => setCarForm((prev) => ({ ...prev, category: event.target.value }))}
                  required
                  className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <input
                placeholder="Image URL"
                value={carForm.image}
                onChange={(event) => setCarForm((prev) => ({ ...prev, image: event.target.value }))}
                required
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
              <textarea
                rows={4}
                placeholder="Description"
                value={carForm.description}
                onChange={(event) => setCarForm((prev) => ({ ...prev, description: event.target.value }))}
                required
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-3xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Add car to fleet
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
