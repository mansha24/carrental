import { NextResponse } from "next/server";
import { createUser, createSession, getUserByEmail } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body as { name: string; email: string; password: string };

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
    }

    const user = await createUser({ name, email, password, role: "user" });
    const token = await createSession(user.id);

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to create account." },
      { status: 500 }
    );
  }
}
