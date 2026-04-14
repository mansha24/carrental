import Header from "../components/Header";
import BookingTracker from "../components/BookingTracker";

export default function UserDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-500">User dashboard</p>
            <h1 className="text-4xl font-semibold text-slate-950">Track your reservations.</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Enter the email you used for your booking to see current reservation details and status updates in real time.
            </p>
          </div>
          <div className="mt-10">
            <BookingTracker />
          </div>
        </section>
      </div>
    </main>
  );
}
