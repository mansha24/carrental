import type { Car } from "../types";

type FleetSectionProps = {
  cars: Car[];
};

export default function FleetSection({ cars }: FleetSectionProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Our fleet</p>
        <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Premium vehicles for every ride.</h2>
        <p className="max-w-2xl text-slate-600">
          Browse our available cars, pick the model that matches your trip, and reserve it with a secure PostgreSQL-backed booking process.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cars.map((car) => (
          <article key={car.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-52 w-full object-cover" />
            <div className="p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-500">{car.category}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">{car.brand} {car.model}</h3>
              <p className="mt-2 text-sm text-slate-600">{car.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                <span className="rounded-full bg-slate-100 px-3 py-1">{car.year}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{car.seats} seats</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">${car.pricePerDay}/day</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
