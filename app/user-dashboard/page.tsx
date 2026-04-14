import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "../components/Header";
import UserDashboard from "../components/UserDashboard";
import { getUserBySessionToken } from "../lib/auth";

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const user = token ? await getUserBySessionToken(token) : null;

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <UserDashboard user={user} />
      </div>
    </main>
  );
}
