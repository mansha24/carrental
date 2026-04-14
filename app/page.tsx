"use client";

import { useMemo, useState } from "react";

type Role = "user" | "admin";
type RentalStatus = "Pending" | "Approved" | "Declined";

type User = {
  id: number;
  name: string;
  role: Role;
};

type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  condition: string;
  pricePerDay: number;
  seats: number;
  available: boolean;
  image: string;
};

type RentalRequest = {
  id: number;
  userId: number;
  carId: number;
  days: number;
  status: RentalStatus;
  eligibility: string;
};

const users: User[] = [
  { id: 1, name: "Alex Martin", role: "user" },
  { id: 2, name: "Sofia Lee", role: "admin" },
];

const cars: Car[] = [
  {
    id: 1,
    brand: "Toyota",
    model: "Camry",
    year: 2024,
    condition: "Excellent",
    pricePerDay: 55,
    seats: 5,
    available: true,
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    brand: "Honda",
    model: "CR-V",
    year: 2023,
    condition: "Very Good",
    pricePerDay: 65,
    seats: 5,
    available: true,
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    brand: "BMW",
    model: "X3",
    year: 2025,
    condition: "Premium",
    pricePerDay: 120,
    seats: 5,
    available: false,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    brand: "Ford",
    model: "Mustang",
    year: 2022,
    condition: "Sport Edition",
    pricePerDay: 110,
    seats: 4,
    available: true,
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1000&q=80",
  },
];

const initialRequests: RentalRequest[] = [
  {
    id: 1,
    userId: 1,
    carId: 3,
    days: 3,
    status: "Approved",
    eligibility: "Age >= 21, license >= 2 years",
  },
];

const eligibilityChecker = (age: number, licenseYears: number, accidents: number) => {
  if (age < 21) return "Applicant must be at least 21 years old.";
  if (licenseYears < 2) return "Driver must have at least 2 years of license experience.";
  if (accidents > 1) return "Too many recent accidents for this rental.";
  return "Eligible";
};

export default function Home() {
  const [role, setRole] = useState<Role>("user");
  const [selectedCarId, setSelectedCarId] = useState<number>(1);
  const [days, setDays] = useState<number>(3);
  const [age, setAge] = useState<number>(28);
  const [licenseYears, setLicenseYears] = useState<number>(4);
  const [accidents, setAccidents] = useState<number>(0);
  const [requests, setRequests] = useState<RentalRequest[]>(initialRequests);

  const currentUser = users.find((item) => item.role === role) ?? users[0];

  const rentedCarIds = useMemo(
    () => requests.filter((request) => request.status === "Approved").map((request) => request.carId),
    [requests]
  );

  const dynamicCars = useMemo(
    () =>
      cars.map((car) => ({
        ...car,
        available: car.available && !rentedCarIds.includes(car.id),
      })),
    [rentedCarIds]
  );

  const availableCars = useMemo(
    () => dynamicCars.filter((car) => car.available),
    [dynamicCars]
  );

  const selectedCar = dynamicCars.find((car) => car.id === selectedCarId);

  const eligibilityMessage = eligibilityChecker(age, licenseYears, accidents);
  const isEligible = eligibilityMessage === "Eligible";

  const handleRequest = () => {
    if (!selectedCar || !selectedCar.available) return;
    const newRequest: RentalRequest = {
      id: requests.length + 1,
      userId: currentUser.id,
      carId: selectedCar.id,
      days,
      status: "Pending",
      eligibility: eligibilityMessage,
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  const updateRequest = (id: number, status: RentalStatus) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const pendingRequests = requests.filter((request) => request.status === "Pending");

  const requestRows = requests.map((request) => {
    const car = cars.find((item) => item.id === request.carId);
    const user = users.find((item) => item.id === request.userId);
    return {
      ...request,
      carName: car ? `${car.brand} ${car.model}` : "Unknown car",
      userName: user ? user.name : "Unknown user",
    };
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-700">Car Rental System</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Rent a car, check eligibility, and approve requests.
              </h1>
              <p className="mt-4 max-w-2xl text-slate-600">
                This system simulates a MySQL-style rental workflow with roles for user and admin, car inventory, eligibility checks, and approval processes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setRole("user")}
                className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                  role === "user"
                    ? "border-sky-700 bg-sky-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                }`}
              >
                User View
              </button>
              <button
                onClick={() => setRole("admin")}
                className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                  role === "admin"
                    ? "border-sky-700 bg-sky-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                }`}
              >
                Admin View
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">Available cars for rent</h2>
                  <p className="mt-2 text-slate-600">
                    Select a car and submit a request. Admins can approve rental requests once eligibility is confirmed.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                  Simulated MySQL tables: <strong>cars</strong>, <strong>users</strong>, <strong>rentals</strong>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {cars.map((car) => (
                  <div key={car.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="h-56 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-950">
                            {car.brand} {car.model}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">{car.year} • {car.seats} seats</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            car.available ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {car.available ? "Available" : "Rented"}
                        </span>
                      </div>
                      <p className="mt-4 text-slate-600">Condition: {car.condition}</p>
                      <div className="mt-5 flex items-center justify-between text-slate-900">
                        <span className="text-lg font-semibold">${car.pricePerDay}/day</span>
                        {!car.available && <span className="text-sm text-slate-500">Unavailable</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {role === "user" ? (
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">Rent a car</h2>
                    <p className="mt-2 text-slate-600">Check your eligibility and request rental approval.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                    Current user: <strong>{currentUser.name}</strong>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-700">
                        Choose car
                        <select
                          value={selectedCarId}
                          onChange={(event) => setSelectedCarId(Number(event.target.value))}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                        >
                          {availableCars.map((car) => (
                            <option key={car.id} value={car.id}>
                              {car.brand} {car.model} ({car.year})
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        Rental days
                        <input
                          type="number"
                          min={1}
                          value={days}
                          onChange={(event) => setDays(Number(event.target.value))}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="space-y-2 text-sm text-slate-700">
                        Age
                        <input
                          type="number"
                          min={18}
                          value={age}
                          onChange={(event) => setAge(Number(event.target.value))}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                        />
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        License years
                        <input
                          type="number"
                          min={0}
                          value={licenseYears}
                          onChange={(event) => setLicenseYears(Number(event.target.value))}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                        />
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        Accidents
                        <input
                          type="number"
                          min={0}
                          value={accidents}
                          onChange={(event) => setAccidents(Number(event.target.value))}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                        />
                      </label>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                      <p className="text-sm font-semibold text-slate-950">Eligibility result</p>
                      <p className={`mt-3 text-sm ${isEligible ? "text-emerald-700" : "text-rose-700"}`}>
                        {eligibilityMessage}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Selected car</p>
                    {selectedCar ? (
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-lg font-semibold text-slate-950">
                            {selectedCar.brand} {selectedCar.model}
                          </p>
                          <p className="text-sm text-slate-500">{selectedCar.condition}</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-3xl bg-white p-4">
                            <p className="text-sm text-slate-500">Price per day</p>
                            <p className="mt-2 text-xl font-semibold text-slate-950">${selectedCar.pricePerDay}</p>
                          </div>
                          <div className="rounded-3xl bg-white p-4">
                            <p className="text-sm text-slate-500">Total estimate</p>
                            <p className="mt-2 text-xl font-semibold text-slate-950">${selectedCar.pricePerDay * days}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRequest}
                          disabled={!isEligible}
                          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Submit rental request
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Select an available car first.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">Admin approval queue</h2>
                    <p className="mt-2 text-slate-600">Review pending rental requests and approve or decline.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                    Current admin: <strong>{currentUser.name}</strong>
                  </div>
                </div>
                {pendingRequests.length === 0 ? (
                  <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                    No pending rental requests at the moment.
                  </div>
                ) : (
                  <div className="mt-8 space-y-4">
                    {pendingRequests.map((request) => {
                      const car = cars.find((item) => item.id === request.carId);
                      const user = users.find((item) => item.id === request.userId);
                      return (
                        <div key={request.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">Request #{request.id}</p>
                              <p className="mt-1 text-sm text-slate-600">
                                {user?.name} requested {car?.brand} {car?.model} for {request.days} days.
                              </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                              <button
                                type="button"
                                onClick={() => updateRequest(request.id, "Approved")}
                                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => updateRequest(request.id, "Declined")}
                                className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                          <p className="mt-4 rounded-3xl bg-white p-4 text-sm text-slate-600">
                            Eligibility: {request.eligibility}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-semibold text-slate-950">Rental history</h2>
              <p className="mt-3 text-slate-600">All requests capture the workflow of a database-driven rental service.</p>
              <div className="mt-6 space-y-4">
                {requestRows.map((row) => (
                  <div key={row.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{row.carName}</p>
                        <p className="mt-1 text-sm text-slate-600">Requested by {row.userName}</p>
                      </div>
                      <span
                        className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                          row.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : row.status === "Declined"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{row.days} days rental</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-2xl font-semibold text-slate-950">Database concept</h2>
              <p className="mt-3 text-slate-600">
                This page demonstrates a data model similar to MySQL tables used in a rental system.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="rounded-2xl bg-slate-50 p-4">
                  <strong>cars:</strong> car inventory, availability status, pricing, and condition.
                </li>
                <li className="rounded-2xl bg-slate-50 p-4">
                  <strong>users:</strong> role-based access for renters and admins.
                </li>
                <li className="rounded-2xl bg-slate-50 p-4">
                  <strong>rentals:</strong> request lifecycle, eligibility, approvals, and history.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
