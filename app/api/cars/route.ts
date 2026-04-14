import { NextResponse } from "next/server";
import { getCars, createCar, deleteCar } from "../../lib/db";
import { getSessionToken, getUserBySessionToken } from "../../lib/auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || undefined;
    const cars = await getCars(category);
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to load cars." },
      { status: 500 }
    );
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

    const payload = await request.json();
    const car = await createCar(payload);
    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create car." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getSessionToken(request);
    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const user = await getUserBySessionToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const payload = await request.json();
    const id = Number(payload?.id);
    if (!id) {
      return NextResponse.json({ error: "Car id is required." }, { status: 400 });
    }

    await deleteCar(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete car." },
      { status: 500 }
    );
  }
}
