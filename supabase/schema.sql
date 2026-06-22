-- ── USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE,
  name TEXT,
  password TEXT, 
  role TEXT DEFAULT 'admin',
  status TEXT DEFAULT 'Active',
  joined DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Simplified policies for database-only auth (allows CRUD via anon/manual auth)
DROP POLICY IF EXISTS "users_select_all" ON users;
CREATE POLICY "users_select_all" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_insert_all" ON users;
CREATE POLICY "users_insert_all" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "users_update_all" ON users;
CREATE POLICY "users_update_all" ON users FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "users_delete_ceo" ON users;
CREATE POLICY "users_delete_ceo" ON users FOR DELETE USING (true);

-- ── SALES ENTRIES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  client TEXT,
  product TEXT,
  qty INTEGER,
  amount NUMERIC,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sales_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sales_all_access" ON sales_entries;
CREATE POLICY "sales_all_access" ON sales_entries FOR ALL USING (true) WITH CHECK (true);

-- ── INVENTORY ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  sku TEXT,
  barcode TEXT,
  category TEXT,
  selling_price NUMERIC,
  warehouse_loc TEXT,
  units TEXT,
  unit TEXT,
  reorder_level INTEGER,
  purchase_price NUMERIC,
  supplier_name TEXT,
  supplier_id TEXT,
  company_name TEXT,
  contact_num TEXT,
  supplier_email TEXT,
  address TEXT,
  stock_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "inventory_all_access" ON inventory;
CREATE POLICY "inventory_all_access" ON inventory FOR ALL USING (true) WITH CHECK (true);

-- ── SUPPLIER PAYMENTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplier_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier TEXT,
  invoice TEXT,
  invoice_date DATE,
  paid_date DATE,
  transaction_date DATE,
  transaction_details TEXT,
  total_amount NUMERIC,
  paid_amount NUMERIC,
  pending_amount NUMERIC,
  due DATE,
  payment_method TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE supplier_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payments_all_access" ON supplier_payments;
CREATE POLICY "payments_all_access" ON supplier_payments FOR ALL USING (true) WITH CHECK (true);

-- ── RECEIVABLES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS receivables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client TEXT,
  invoice TEXT,
  due DATE,
  amount NUMERIC,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE receivables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "receivables_all_access" ON receivables;
CREATE POLICY "receivables_all_access" ON receivables FOR ALL USING (true) WITH CHECK (true);

-- ── FABRIC ORDERS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fabric_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fabric TEXT,
  qty TEXT,
  supplier TEXT,
  order_date DATE DEFAULT CURRENT_DATE,
  delivery DATE,
  amount NUMERIC,
  status TEXT DEFAULT 'Ordered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fabric_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "fabric_all_access" ON fabric_orders;
CREATE POLICY "fabric_all_access" ON fabric_orders FOR ALL USING (true) WITH CHECK (true);

-- ── GOOGLE ADS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS google_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign TEXT,
  type TEXT,
  budget NUMERIC,
  spend NUMERIC,
  clicks INTEGER,
  impressions INTEGER,
  conversions INTEGER,
  revenue NUMERIC,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE google_ads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "google_ads_all_access" ON google_ads;
CREATE POLICY "google_ads_all_access" ON google_ads FOR ALL USING (true) WITH CHECK (true);

-- ── META ADS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meta_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign TEXT,
  type TEXT,
  budget NUMERIC,
  spend NUMERIC,
  reach INTEGER,
  impressions INTEGER,
  conversions INTEGER,
  revenue NUMERIC,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meta_ads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "meta_ads_all_access" ON meta_ads;
CREATE POLICY "meta_ads_all_access" ON meta_ads FOR ALL USING (true) WITH CHECK (true);

-- ── INVESTMENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  type TEXT,
  val TEXT,
  note TEXT,
  change TEXT,
  up BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "investments_all_access" ON investments;
CREATE POLICY "investments_all_access" ON investments FOR ALL TO public USING (true) WITH CHECK (true);

-- ── STRATEGIC DECISIONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS strategic_decisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dot TEXT,
  title TEXT,
  body TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE strategic_decisions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "decisions_all_access" ON strategic_decisions;
CREATE POLICY "decisions_all_access" ON strategic_decisions FOR ALL TO public USING (true) WITH CHECK (true);

-- ── COMMUNICATION ADS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS communication_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign TEXT,
  type TEXT,
  budget NUMERIC,
  spend NUMERIC,
  reach INTEGER,
  impressions INTEGER,
  conversions INTEGER,
  revenue NUMERIC,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE communication_ads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comm_ads_all_access" ON communication_ads;
CREATE POLICY "comm_ads_all_access" ON communication_ads FOR ALL TO public USING (true) WITH CHECK (true);

-- ── ABANDONED CARTS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer TEXT,
  product TEXT,
  cart_value NUMERIC,
  recovery_channel TEXT DEFAULT 'WhatsApp',
  status TEXT DEFAULT 'Abandoned',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "abandoned_carts_all_access" ON abandoned_carts;
CREATE POLICY "abandoned_carts_all_access" ON abandoned_carts FOR ALL TO public USING (true) WITH CHECK (true);

-- ── INVENTORY MIGRATION (run if inventory table already exists with old column names) ──
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS purchase_price NUMERIC;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS reorder_level INTEGER;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS stock_status TEXT;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS supplier_email TEXT;
UPDATE inventory SET purchase_price = cost WHERE purchase_price IS NULL AND cost IS NOT NULL;
UPDATE inventory SET reorder_level = reorder WHERE reorder_level IS NULL AND reorder IS NOT NULL;
UPDATE inventory SET stock_status = status WHERE stock_status IS NULL AND status IS NOT NULL;
