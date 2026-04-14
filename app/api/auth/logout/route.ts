import { NextResponse } from "next/server";
import { deleteSession, getSessionToken } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const token = getSessionToken(request);
    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ message: "Signed out." }, { status: 200 });
    response.cookies.set({
      name: "session",
      value: "",
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unable to sign out." }, { status: 500 });
  }
}
