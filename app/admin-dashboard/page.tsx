import Header from "../components/Header";
import AdminDashboard from "../components/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">Admin dashboard</p>
            <h1 className="text-4xl font-semibold text-slate-950">Manage rental bookings.</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Review incoming reservations and approve or decline bookings from the dedicated admin panel.
            </p>
          </div>
          <div className="mt-10">
            <AdminDashboard />
          </div>
        </section>
      </div>
    </main>
  );
}
