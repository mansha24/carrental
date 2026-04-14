export default function FeaturesSection() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3 rounded-[1.75rem] bg-slate-950/95 p-6 text-white shadow-lg shadow-slate-900/5 transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Why choose us</p>
          <h3 className="text-2xl font-semibold">Local support, global reliability</h3>
          <p className="text-slate-300">Our team helps every customer choose the right vehicle, complete paperwork quickly, and enjoy on-demand assistance.</p>
        </div>

        <div className="space-y-3 rounded-[1.75rem] bg-slate-50 p-6 transition duration-500 hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-slate-950">Flexible pricing</h3>
          <p className="text-slate-600">Pay only for the days you need with transparent daily rates, long-term discounts, and fast booking confirmation.</p>
        </div>

        <div className="space-y-3 rounded-[1.75rem] bg-slate-50 p-6 transition duration-500 hover:-translate-y-1 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-slate-950">Secure bookings</h3>
          <p className="text-slate-600">All reservations are stored in a secure PostgreSQL database and processed instantly on submission.</p>
        </div>
      </div>
    </section>
  );
}
