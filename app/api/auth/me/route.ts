import { NextResponse } from "next/server";
import { getSessionToken, getUserBySessionToken } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await getUserBySessionToken(token);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Failed to fetch session." }, { status: 500 });
  }
}
