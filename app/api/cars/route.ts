import { NextResponse } from "next/server";
import { getAvailableCars } from "../../lib/db";

export async function GET() {
  try {
    const cars = await getAvailableCars();
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to load cars." },
      { status: 500 }
    );
  }
}
