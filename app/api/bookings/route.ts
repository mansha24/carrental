import { NextResponse } from "next/server";
import { createBooking } from "../../lib/db";
import type { BookingRequest } from "../../types";

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
