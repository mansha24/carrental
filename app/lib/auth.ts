import { randomUUID, createHash } from "crypto";
import { query } from "./db";
import { sendEmail } from "./email";
import type { User, UserRole, Notification } from "../types";

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function createUser({
  name,
  email,
  password,
  role = "user",
}: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<User> {
  const passwordHash = hashPassword(password);
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email.toLowerCase(), passwordHash, role]
  );

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    role: result.rows[0].role,
    createdAt: result.rows[0].created_at.toISOString(),
  };
}

export async function getUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const result = await query(
    `SELECT id, name, email, role, created_at, password_hash
     FROM users WHERE email = $1 LIMIT 1`,
    [email.toLowerCase()]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    role: result.rows[0].role,
    createdAt: result.rows[0].created_at.toISOString(),
    passwordHash: result.rows[0].password_hash,
  };
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const hashedPassword = hashPassword(password);
  if (user.passwordHash !== hashedPassword) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function createSession(userId: number): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await query(
    `INSERT INTO sessions (token, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [token, userId, expiresAt]
  );

  return token;
}

export async function getSessionByToken(token: string): Promise<{ id: number; userId: number; expiresAt: string } | null> {
  const result = await query(
    `SELECT id, user_id, expires_at FROM sessions WHERE token = $1 AND expires_at > NOW() LIMIT 1`,
    [token]
  );
  if (result.rowCount === 0) return null;
  return {
    id: result.rows[0].id,
    userId: result.rows[0].user_id,
    expiresAt: result.rows[0].expires_at.toISOString(),
  };
}

export async function getUserBySessionToken(token: string): Promise<User | null> {
  const session = await getSessionByToken(token);
  if (!session) return null;

  const result = await query(
    `SELECT id, name, email, role, created_at
     FROM users WHERE id = $1 LIMIT 1`,
    [session.userId]
  );

  if (result.rowCount === 0) return null;

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    role: result.rows[0].role,
    createdAt: result.rows[0].created_at.toISOString(),
  };
}

export async function deleteSession(token: string) {
  await query(`DELETE FROM sessions WHERE token = $1`, [token]);
}

export async function assignUserRole(email: string, role: UserRole): Promise<User> {
  const result = await query(
    `UPDATE users SET role = $2 WHERE email = $1 RETURNING id, name, email, role, created_at`,
    [email.toLowerCase(), role]
  );

  if (result.rowCount === 0) {
    throw new Error("User not found.");
  }

  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    role: result.rows[0].role,
    createdAt: result.rows[0].created_at.toISOString(),
  };
}

export async function getAllUsers(): Promise<User[]> {
  const result = await query(`SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`);
  return result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function createNotificationForUserEmail(email: string, title: string, message: string): Promise<Notification> {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  await sendEmail({
    to: user.email,
    subject: title,
    text: message,
    html: `<div style="font-family:system-ui, sans-serif; line-height:1.5; color:#111;"><h2>${title}</h2><p>${message}</p></div>`,
  });

  const result = await query(
    `INSERT INTO notifications (user_id, title, message)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, title, message, read, created_at`,
    [user.id, title, message]
  );

  return {
    id: result.rows[0].id,
    userId: result.rows[0].user_id,
    title: result.rows[0].title,
    message: result.rows[0].message,
    read: result.rows[0].read,
    createdAt: result.rows[0].created_at.toISOString(),
  };
}

export async function getNotificationsForUserId(userId: number): Promise<Notification[]> {
  const result = await query(
    `SELECT id, user_id, title, message, read, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    read: row.read,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function markNotificationRead(notificationId: number, userId: number): Promise<Notification> {
  const result = await query(
    `UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2 RETURNING id, user_id, title, message, read, created_at`,
    [notificationId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Notification not found.");
  }

  return {
    id: result.rows[0].id,
    userId: result.rows[0].user_id,
    title: result.rows[0].title,
    message: result.rows[0].message,
    read: result.rows[0].read,
    createdAt: result.rows[0].created_at.toISOString(),
  };
}

export function getSessionToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((piece) => piece.trim())
    .find((piece) => piece.startsWith("session="));

  return match ? match.split("=")[1] : null;
}
