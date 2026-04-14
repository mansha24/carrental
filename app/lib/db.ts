import { Pool } from "pg";
import type { Booking, BookingRequest, Car, CarInput } from "../types";

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

function mapCar(row: any): Car {
  return {
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
  };
}

export async function getAvailableCars(): Promise<Car[]> {
  return getCars();
}

export async function getCars(category?: string): Promise<Car[]> {
  const queryText = category
    ? `SELECT id, brand, model, year, condition, price_per_day, seats, available, image, description, category
       FROM cars WHERE available = true AND category = $1 ORDER BY brand, model`
    : `SELECT id, brand, model, year, condition, price_per_day, seats, available, image, description, category
       FROM cars WHERE available = true ORDER BY brand, model`;

  const result = await query(queryText, category ? [category] : []);
  return result.rows.map(mapCar);
}

export async function createCar(payload: CarInput): Promise<Car> {
  const { brand, model, year, condition, pricePerDay, seats, image, description, category, available } = payload;
  const result = await query(
    `INSERT INTO cars (brand, model, year, condition, price_per_day, seats, available, image, description, category)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, brand, model, year, condition, price_per_day, seats, available, image, description, category`,
    [brand, model, year, condition, pricePerDay, seats, available, image, description, category]
  );

  return mapCar(result.rows[0]);
}

function formatBookingRow(row: any): Booking {
  const startDate = row.start_date instanceof Date ? row.start_date.toISOString().split("T")[0] : row.start_date;
  const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    carId: row.car_id,
    startDate,
    days: row.days,
    message: row.message,
    priceTotal: Number(row.price_total),
    status: row.status,
    createdAt,
    carName: `${row.brand} ${row.model}`,
  };
}

export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  const result = await query(
    `SELECT b.id, b.name, b.email, b.phone, b.car_id, b.start_date, b.days, b.price_total, b.message, b.status, b.created_at,
            c.brand, c.model
     FROM bookings b
     JOIN cars c ON c.id = b.car_id
     WHERE b.email = $1
     ORDER BY b.created_at DESC`,
    [email]
  );

  return result.rows.map(formatBookingRow);
}

export async function getBookingsByStatus(status: string): Promise<Booking[]> {
  const result = await query(
    `SELECT b.id, b.name, b.email, b.phone, b.car_id, b.start_date, b.days, b.price_total, b.message, b.status, b.created_at,
            c.brand, c.model
     FROM bookings b
     JOIN cars c ON c.id = b.car_id
     WHERE b.status = $1
     ORDER BY b.created_at DESC`,
    [status]
  );

  return result.rows.map(formatBookingRow);
}

export async function updateBookingStatus(id: number, status: string): Promise<Booking> {
  const result = await query(
    `UPDATE bookings SET status = $2 WHERE id = $1 RETURNING id, name, email, phone, car_id, start_date, days, price_total, message, status, created_at`,
    [id, status]
  );

  if (result.rowCount === 0) {
    throw new Error("Booking not found.");
  }

  const bookingRow = result.rows[0];
  const carResult = await query(`SELECT brand, model FROM cars WHERE id = $1`, [bookingRow.car_id]);
  const car = carResult.rows[0];

  return formatBookingRow({ ...bookingRow, brand: car.brand, model: car.model });
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
