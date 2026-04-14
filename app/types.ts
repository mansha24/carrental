export type UserRole = "user" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type Notification = {
  id: number;
  userId: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  condition: string;
  pricePerDay: number;
  seats: number;
  available: boolean;
  image: string;
  description: string;
  category: string;
};

export type CarInput = Omit<Car, "id">;

export type BookingRequest = {
  name: string;
  email: string;
  phone: string;
  carId: number;
  startDate: string;
  days: number;
  message?: string;
};

export type Booking = BookingRequest & {
  id: number;
  priceTotal: number;
  status: string;
  createdAt: string;
  carName: string;
};
