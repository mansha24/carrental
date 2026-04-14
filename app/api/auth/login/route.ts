import { NextResponse } from "next/server";
import { verifyUser, createSession, getUserByEmail } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await verifyUser(email, password);
    if (!user) {
      const exists = await getUserByEmail(email);
      const code = exists ? 401 : 404;
      return NextResponse.json({ error: "Invalid email or password." }, { status: code });
    }

    const token = await createSession(user.id);
    const response = NextResponse.json({ user }, { status: 200 });
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
    return NextResponse.json({ error: (error as Error).message || "Unable to sign in." }, { status: 500 });
  }
}
