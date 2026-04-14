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

export type BookingRequest = {
  name: string;
  email: string;
  phone: string;
  carId: number;
  startDate: string;
  days: number;
  message?: string;
};
