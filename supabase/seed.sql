-- GarageOS Seed Data
-- Run: supabase db execute --linked < supabase/seed.sql
-- Or via dashboard SQL editor

-- Note: This seed assumes a user already exists via Supabase Auth.
-- Replace the owner_id with your actual auth user UUID after first login.

DO $$
DECLARE
  v_owner_id uuid := '00000000-0000-0000-0000-000000000001'; -- Replace after first login
  v_shop_id uuid := gen_random_uuid();
  v_cust1 uuid := gen_random_uuid();
  v_cust2 uuid := gen_random_uuid();
  v_cust3 uuid := gen_random_uuid();
  v_cust4 uuid := gen_random_uuid();
  v_cust5 uuid := gen_random_uuid();
  v_veh1 uuid := gen_random_uuid();
  v_veh2 uuid := gen_random_uuid();
  v_veh3 uuid := gen_random_uuid();
  v_veh4 uuid := gen_random_uuid();
  v_veh5 uuid := gen_random_uuid();
  v_job1 uuid := gen_random_uuid();
  v_job2 uuid := gen_random_uuid();
  v_job3 uuid := gen_random_uuid();
  v_job4 uuid := gen_random_uuid();
  v_job5 uuid := gen_random_uuid();
  v_sup1 uuid := gen_random_uuid();
  v_sup2 uuid := gen_random_uuid();
BEGIN

-- Shop
INSERT INTO shops (id, owner_id, name, description, address, phone, email, timezone, currency, status)
VALUES (v_shop_id, v_owner_id, 'สมชาย ออโต้ เซอร์วิส', 'Full-service auto repair shop in Bangkok', '123 Sukhumvit Rd, Khlong Toei, Bangkok 10110', '02-123-4567', 'info@somchai-auto.com', 'Asia/Bangkok', 'THB', 'active');

-- Customers
INSERT INTO customers (id, shop_id, name, phone, email, address) VALUES
(v_cust1, v_shop_id, 'Somchai Srisakul', '081-234-5678', 'somchai@email.com', '45 Silom Rd, Bangkok'),
(v_cust2, v_shop_id, 'Nattaporn Chaiyasit', '089-876-5432', 'nattaporn@email.com', '78 Ratchadaphisek Rd, Bangkok'),
(v_cust3, v_shop_id, 'Prasert Wongsawat', '062-345-6789', 'prasert@email.com', '12 Phahonyothin Rd, Bangkok'),
(v_cust4, v_shop_id, 'Kannika Thongkam', '095-111-2222', 'kannika@email.com', '56 Rama IV Rd, Bangkok'),
(v_cust5, v_shop_id, 'Wichai Pongpanich', '084-333-4444', 'wichai@email.com', '90 Lat Phrao Rd, Bangkok');

-- Vehicles
INSERT INTO vehicles (id, shop_id, license_plate, brand, model, year, color, mileage, fuel_type, transmission, customer_id) VALUES
(v_veh1, v_shop_id, 'กก 1234', 'Toyota', 'Camry', 2022, 'White', 35000, 'gasoline', 'automatic', v_cust1),
(v_veh2, v_shop_id, 'ขข 5678', 'Honda', 'Civic', 2021, 'Black', 42000, 'gasoline', 'automatic', v_cust2),
(v_veh3, v_shop_id, 'คค 9012', 'Ford', 'Ranger', 2020, 'Blue', 68000, 'diesel', 'automatic', v_cust3),
(v_veh4, v_shop_id, 'งง 3456', 'Mazda', 'CX-5', 2023, 'Red', 15000, 'gasoline', 'automatic', v_cust4),
(v_veh5, v_shop_id, 'จจ 7890', 'Isuzu', 'D-Max', 2019, 'Silver', 95000, 'diesel', 'manual', v_cust5);

-- Suppliers
INSERT INTO suppliers (id, shop_id, name, contact_person, phone, email, rating) VALUES
(v_sup1, v_shop_id, 'Thai Auto Parts Co.', 'Anan Suwannapong', '02-555-1234', 'sales@thaiautoparts.com', 4.5),
(v_sup2, v_shop_id, 'Bangkok Brake & Tire', 'Pim Jantarasorn', '02-555-5678', 'info@bkk-brake.com', 4.2);

-- Parts/Inventory
INSERT INTO parts (shop_id, name, part_number, category, brand, supplier_id, cost_price, sell_price, quantity, min_quantity, status) VALUES
(v_shop_id, 'Engine Oil 5W-30 (4L)', 'OIL-5W30-4L', 'Fluids', 'Castrol', v_sup1, 450, 750, 25, 5, 'in_stock'),
(v_shop_id, 'Oil Filter - Toyota', 'FIL-TOY-001', 'Filters', 'Denso', v_sup1, 120, 250, 15, 3, 'in_stock'),
(v_shop_id, 'Brake Pads Front - Universal', 'BRK-FRT-UNI', 'Brakes', 'Brembo', v_sup2, 800, 1500, 2, 4, 'low_stock'),
(v_shop_id, 'Air Filter - Honda', 'FIL-HON-AIR', 'Filters', 'Denso', v_sup1, 180, 350, 8, 3, 'in_stock'),
(v_shop_id, 'Spark Plug Set (4pc)', 'SPK-NGK-4PC', 'Engine', 'NGK', v_sup1, 320, 600, 12, 4, 'in_stock'),
(v_shop_id, 'Transmission Fluid ATF (1L)', 'FLD-ATF-1L', 'Fluids', 'Aisin', v_sup1, 280, 450, 10, 3, 'in_stock'),
(v_shop_id, 'Coolant Green (1L)', 'FLD-COOL-1L', 'Fluids', 'Prestone', v_sup1, 150, 280, 0, 5, 'out_of_stock'),
(v_shop_id, 'Wiper Blade 22"', 'WIP-22-UNI', 'Exterior', 'Bosch', v_sup2, 250, 450, 6, 2, 'in_stock');

-- Job Cards
INSERT INTO job_cards (id, shop_id, vehicle_id, customer_id, title, description, status, estimated_cost, estimated_hours, created_at) VALUES
(v_job1, v_shop_id, v_veh1, v_cust1, 'Oil Change + Filter', 'Regular 10,000km service - oil change and filter replacement', 'completed', 1500, 1, now() - interval '3 days'),
(v_job2, v_shop_id, v_veh2, v_cust2, 'Brake Inspection & Pad Replacement', 'Customer reports squeaking sound when braking', 'in_progress', 4500, 2.5, now() - interval '1 day'),
(v_job3, v_shop_id, v_veh3, v_cust3, 'AC Not Cooling', 'AC blowing warm air, check compressor and refrigerant', 'diagnosed', 3500, 3, now() - interval '2 days'),
(v_job4, v_shop_id, v_veh4, v_cust4, 'Annual Inspection', 'Full vehicle inspection for insurance renewal', 'inspection', 800, 1.5, now()),
(v_job5, v_shop_id, v_veh5, v_cust5, 'Transmission Service', 'ATF change and filter - 100,000km service', 'parts_ordered', 5500, 4, now() - interval '4 days');

-- Invoices (for completed job)
INSERT INTO invoices (shop_id, job_card_id, invoice_number, customer_id, subtotal, tax, discount, total, status, created_at) VALUES
(v_shop_id, v_job1, 'INV-2024-001', v_cust1, 1350, 94.5, 0, 1444.5, 'paid', now() - interval '2 days'),
(v_shop_id, v_job2, 'INV-2024-002', v_cust2, 4200, 294, 200, 4294, 'sent', now() - interval '1 day');

RAISE NOTICE 'Seed data inserted successfully! Shop ID: %', v_shop_id;
RAISE NOTICE 'Remember to update owner_id (%) with your real auth user UUID', v_owner_id;
END $$;
