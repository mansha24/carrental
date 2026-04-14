import Header from "../components/Header";
import SignupForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <SignupForm />
      </div>
    </main>
  );
}
