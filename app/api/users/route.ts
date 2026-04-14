import { NextResponse } from "next/server";
import { assignUserRole, createUser, getAllUsers, getSessionToken, getUserBySessionToken } from "../../lib/auth";

async function getAdminUser(request: Request) {
  const token = getSessionToken(request);
  if (!token) {
    return null;
  }
  const user = await getUserBySessionToken(token);
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

export async function GET(request: Request) {
  try {
    const user = await getAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unable to load users." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role } = body as { name: string; email: string; password: string; role: string };
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Name, email, password, and role are required." }, { status: 400 });
    }

    const created = await createUser({ name, email, password, role: role as "user" | "admin" });
    return NextResponse.json({ user: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unable to create user." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAdminUser(request);
    if (!user) {
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
