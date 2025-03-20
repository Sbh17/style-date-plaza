
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'superadmin')) DEFAULT 'user',
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create salons table
CREATE TABLE IF NOT EXISTS salons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  logo_url TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  duration INTEGER NOT NULL CHECK (duration > 0), -- in minutes
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stylists table
CREATE TABLE IF NOT EXISTS stylists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT time_check CHECK (start_time < end_time)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Each user can only review a salon once per appointment
  CONSTRAINT unique_user_salon_appointment UNIQUE (user_id, salon_id, appointment_id)
);

-- Create news/promotions table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT date_check CHECK (starts_at < ends_at)
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Using DROP POLICY IF EXISTS to ensure we don't get duplicate policy errors
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Superadmins can view all profiles" ON profiles;
CREATE POLICY "Superadmins can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'superadmin'
  )
);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Superadmins can update any profile" ON profiles;
CREATE POLICY "Superadmins can update any profile" 
ON profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'superadmin'
  )
);

DROP POLICY IF EXISTS "Superadmins can insert profiles" ON profiles;
CREATE POLICY "Superadmins can insert profiles" 
ON profiles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'superadmin'
  )
);

-- Salon policies (updated for superadmin)
DROP POLICY IF EXISTS "Salons are viewable by everyone" ON salons;
CREATE POLICY "Salons are viewable by everyone" 
ON salons FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admins and superadmins can insert salons" ON salons;
CREATE POLICY "Admins and superadmins can insert salons" 
ON salons FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND (profiles.role = 'admin' OR profiles.role = 'superadmin')
  )
);

DROP POLICY IF EXISTS "Admins and superadmins can update salons" ON salons;
CREATE POLICY "Admins and superadmins can update salons" 
ON salons FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND (profiles.role = 'admin' OR profiles.role = 'superadmin')
  )
);

DROP POLICY IF EXISTS "Superadmins can delete salons" ON salons;
CREATE POLICY "Superadmins can delete salons" 
ON salons FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

-- Service policies (similar to salons)
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
CREATE POLICY "Services are viewable by everyone" 
ON services FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only admins can insert services" ON services;
CREATE POLICY "Only admins can insert services" 
ON services FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

DROP POLICY IF EXISTS "Only admins can update services" ON services;
CREATE POLICY "Only admins can update services" 
ON services FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Stylist policies (similar to salons)
DROP POLICY IF EXISTS "Stylists are viewable by everyone" ON stylists;
CREATE POLICY "Stylists are viewable by everyone" 
ON stylists FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only admins can insert stylists" ON stylists;
CREATE POLICY "Only admins can insert stylists" 
ON stylists FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

DROP POLICY IF EXISTS "Only admins can update stylists" ON stylists;
CREATE POLICY "Only admins can update stylists" 
ON stylists FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Appointment policies
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
CREATE POLICY "Users can view their own appointments" 
ON appointments FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all appointments" ON appointments;
CREATE POLICY "Admins can view all appointments" 
ON appointments FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

DROP POLICY IF EXISTS "Users can insert their own appointments" ON appointments;
CREATE POLICY "Users can insert their own appointments" 
ON appointments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
CREATE POLICY "Users can update their own appointments" 
ON appointments FOR UPDATE 
USING (auth.uid() = user_id);

-- Review policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone" 
ON reviews FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
CREATE POLICY "Users can insert their own reviews" 
ON reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" 
ON reviews FOR UPDATE 
USING (auth.uid() = user_id);

-- News policies
DROP POLICY IF EXISTS "Public news is viewable by everyone" ON news;
CREATE POLICY "Public news is viewable by everyone" 
ON news FOR SELECT 
USING (is_approved = true);

DROP POLICY IF EXISTS "Admins can view all news for their salon" ON news;
CREATE POLICY "Admins can view all news for their salon" 
ON news FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

DROP POLICY IF EXISTS "Admins can insert news for their salon" ON news;
CREATE POLICY "Admins can insert news for their salon" 
ON news FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

DROP POLICY IF EXISTS "Admins can update their salon's news" ON news;
CREATE POLICY "Admins can update their salon's news" 
ON news FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Add a few more helpful policies for superadmins

-- Service policies (updated for superadmin)
DROP POLICY IF EXISTS "Superadmins can manage all services" ON services;
CREATE POLICY "Superadmins can manage all services" 
ON services FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

-- Stylist policies (updated for superadmin)
DROP POLICY IF EXISTS "Superadmins can manage all stylists" ON stylists;
CREATE POLICY "Superadmins can manage all stylists" 
ON stylists FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

-- Appointment policies (updated for superadmin)
DROP POLICY IF EXISTS "Superadmins can view all appointments" ON appointments;
CREATE POLICY "Superadmins can view all appointments" 
ON appointments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

DROP POLICY IF EXISTS "Superadmins can manage all appointments" ON appointments;
CREATE POLICY "Superadmins can manage all appointments" 
ON appointments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

DROP POLICY IF EXISTS "Superadmins can update all appointments" ON appointments;
CREATE POLICY "Superadmins can update all appointments" 
ON appointments FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

-- News policies (updated for superadmin)
DROP POLICY IF EXISTS "Superadmins can manage all news" ON news;
CREATE POLICY "Superadmins can manage all news" 
ON news FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'superadmin'
  )
);

-- Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_salons_updated_at
BEFORE UPDATE ON salons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stylists_updated_at
BEFORE UPDATE ON stylists
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
