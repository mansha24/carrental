"use client";

import { useEffect, useState } from "react";
import type { Car } from "../types";

type HeroCarouselProps = {
  cars: Car[];
};

export default function HeroCarousel({ cars }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % cars.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, [cars.length]);

  if (cars.length === 0) {
    return (
      <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-white/10 animate-float">
        <p className="text-center text-sm uppercase tracking-[0.32em] text-cyan-300">No cars available</p>
      </div>
    );
  }

  const current = cars[index];

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/80" />
      <div className="relative grid gap-6 px-6 py-8 sm:grid-cols-[1.1fr_0.9fr] sm:items-end">
        <div className="space-y-4">
          <p className="uppercase tracking-[0.32em] text-cyan-300">Featured carousel</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Explore top rides in motion.</h2>
          <p className="max-w-xl text-slate-300">
            Swipe through our premium vehicles and lock in the perfect car from the hero showcase.
          </p>

          <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">{current.brand} {current.model}</p>
            <p className="text-xl font-semibold text-white">{current.category} · {current.year}</p>
            <p className="text-sm text-slate-300">{current.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <span className="rounded-full bg-white/10 px-3 py-1">{current.seats} seats</span>
              <span className="rounded-full bg-white/10 px-3 py-1">${current.pricePerDay}/day</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{current.condition}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            {cars.map((car, carIndex) => (
              <button
                key={car.id}
                type="button"
                onClick={() => setIndex(carIndex)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  carIndex === index ? "bg-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.55)]" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-inner shadow-slate-950/40">
          <img
            src={current.image}
            alt={`${current.brand} ${current.model}`}
            className="h-72 w-full object-cover transition duration-700 ease-out sm:h-[360px]"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/20" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Current selection</p>
            <p className="mt-3 text-xl font-semibold">{current.brand} {current.model}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
