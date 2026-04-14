import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <LoginForm />
      </div>
    </main>
  );
}
