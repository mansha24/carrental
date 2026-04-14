import { NextResponse } from "next/server";
import { assignUserRole, getAllUsers, getSessionToken, getUserBySessionToken } from "../../lib/auth";

export async function GET(request: Request) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const user = await getUserBySessionToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unable to load users." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const user = await getUserBySessionToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const { email, role } = body as { email: string; role: string };
    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
    }

    const updated = await assignUserRole(email, role as "user" | "admin");
    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unable to update role." }, { status: 500 });
  }
}
