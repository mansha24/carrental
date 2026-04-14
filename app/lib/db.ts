import { Pool } from "pg";
import type { BookingRequest, Car } from "../types";

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString, max: 10 }) : null;

function getPool() {
  if (!pool) {
    throw new Error("Missing DATABASE_URL environment variable.");
  }
  return pool;
}

export async function query(text: string, params: unknown[] = []) {
  const client = await getPool().connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function getAvailableCars(): Promise<Car[]> {
  const result = await query(
    `SELECT id, brand, model, year, condition, price_per_day, seats, available, image, description, category
     FROM cars WHERE available = true ORDER BY brand, model`
  );

  return result.rows.map((row: any) => ({
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: row.year,
    condition: row.condition,
    pricePerDay: Number(row.price_per_day),
    seats: row.seats,
    available: row.available,
    image: row.image,
    description: row.description,
    category: row.category,
  }));
}

export async function createBooking(payload: BookingRequest) {
  const { name, email, phone, carId, startDate, days, message } = payload;

  if (!name || !email || !phone || !carId || !startDate || !days) {
    throw new Error("Missing required booking fields.");
  }

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const carResult = await client.query(
      `SELECT id, price_per_day FROM cars WHERE id = $1 AND available = true`,
      [carId]
    );

    if (carResult.rowCount === 0) {
      throw new Error("Selected car is not available. Please choose another vehicle.");
    }

    const priceTotal = Number(carResult.rows[0].price_per_day) * days;

    const bookingResult = await client.query(
      `INSERT INTO bookings (name, email, phone, car_id, start_date, days, price_total, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, phone, car_id, start_date, days, price_total, status, created_at`,
      [name, email, phone, carId, startDate, days, priceTotal, message || ""]
    );

    await client.query(`UPDATE cars SET available = false WHERE id = $1`, [carId]);
    await client.query("COMMIT");

    return bookingResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
