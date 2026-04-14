import { NextResponse } from "next/server";
import {
  createNotificationForUserEmail,
  getNotificationsForUserId,
  getUserBySessionToken,
  markNotificationRead,
  getSessionToken,
} from "../../lib/auth";

export async function GET(request: Request) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const user = await getUserBySessionToken(token);
    if (!user) {
      return NextResponse.json({ error: "Session expired." }, { status: 401 });
    }

    const notifications = await getNotificationsForUserId(user.id);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unable to load notifications." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const user = await getUserBySessionToken(token);
    if (!user) {
      return NextResponse.json({ error: "Session expired." }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body as { id: number };
    if (!id) {
      return NextResponse.json({ error: "Notification id is required." }, { status: 400 });
    }

    const notification = await markNotificationRead(id, user.id);
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unable to update notification." }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const { email, title, message } = body as { email: string; title: string; message: string };
    if (!email || !title || !message) {
      return NextResponse.json({ error: "Email, title, and message are required." }, { status: 400 });
    }

    const notification = await createNotificationForUserEmail(email, title, message);
    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Unable to send notification." }, { status: 500 });
  }
}
