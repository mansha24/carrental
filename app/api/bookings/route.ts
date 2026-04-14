import { NextResponse } from "next/server";
import {
  createBooking,
  getBookingsByEmail,
  getBookingsByStatus,
  updateBookingStatus,
} from "../../lib/db";
import { getSessionToken, getUserBySessionToken } from "../../lib/auth";
import type { BookingRequest } from "../../types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const status = url.searchParams.get("status");

    if (email) {
      const bookings = await getBookingsByEmail(email);
      return NextResponse.json(bookings);
    }

    if (status) {
      const token = getSessionToken(request);
      if (!token) {
        return NextResponse.json({ error: "Authentication required." }, { status: 401 });
      }
      const user = await getUserBySessionToken(token);
      if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Admin access required." }, { status: 403 });
      }
      const bookings = await getBookingsByStatus(status);
      return NextResponse.json(bookings);
    }

    return NextResponse.json([], { status: 200 });
  } catch (error) {
    const message = (error as Error).message || "Failed to load bookings.";
    return NextResponse.json({ error: message }, { status: 500 });
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
    const { id, status } = body as { id: number; status: string };

    if (!id || !status) {
      return NextResponse.json({ error: "Missing booking ID or status." }, { status: 400 });
    }

    const booking = await updateBookingStatus(id, status);
    return NextResponse.json({ message: "Booking updated.", booking });
  } catch (error) {
    const message = (error as Error).message || "Failed to update booking.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookingRequest;
    const booking = await createBooking(payload);
    return NextResponse.json({ message: "Booking confirmed.", booking }, { status: 201 });
  } catch (error) {
    const message = (error as Error).message || "Failed to create booking.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
