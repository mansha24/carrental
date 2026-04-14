-- Car rental schema for Neon/PostgreSQL

CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  condition TEXT NOT NULL,
  price_per_day INT NOT NULL,
  seats INT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_id INT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  days INT NOT NULL,
  price_total NUMERIC(10, 2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin', 'admin@carrental.com', 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', 'admin');

INSERT INTO cars (brand, model, year, condition, price_per_day, seats, available, image, description, category)
VALUES
  ('Toyota', 'Camry', 2024, 'Excellent', 55, 5, true,
   'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1000&q=80',
   'Reliable mid-size sedan with premium comfort and excellent fuel economy.', 'Sedan'),
  ('Honda', 'CR-V', 2023, 'Very Good', 65, 5, true,
   'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80',
   'Spacious compact SUV ideal for family trips and weekend adventures.', 'SUV'),
  ('BMW', 'X3', 2025, 'Premium', 120, 5, true,
   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
   'Luxury crossover with sporty handling and advanced technology.', 'Luxury'),
  ('Ford', 'Mustang', 2022, 'Sport Edition', 110, 4, true,
   'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1000&q=80',
   'High-performance coupe for drivers who love power and style.', 'Sports');
