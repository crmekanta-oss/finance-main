# Ekanta BizCore — Business Management System

## Quick Start
```bash
npm install
npm run dev
# → http://localhost:5174/
```

## Supabase Setup (Required for Production)
1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` (Local) or add to Vercel (Production)
3. Add your Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Project Anon Key
4. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor to create tables.
5. **CRITICAL: Enable RLS Policies** for all tables. Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor.
6. Users are managed through Supabase Auth. Profiles are automatically created in the `profiles` table upon sign-up via a database trigger.

## Vercel Deployment
To deploy this project to Vercel:
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project in Vercel.
3. In **Project Settings > Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy the project.

## Role Permissions
- **Admin**: Sales, Inventory, Payments, Receivables, Fabric Orders (full CRUD)
- **Marketing**: Google Ads, Meta Ads, ROI Analytics (full CRUD)  
- **CEO**: All modules (read-only view) + Executive Controls

## Features
- Role-based dashboards with sidebar module navigation
- Add / Edit / Delete with popup forms and validation
- Real-time Supabase sync (falls back to local state)
- Dark / Light mode toggle
- Search & filter on all tables
- Sales & Operations FIRST, Marketing & Ads BELOW (CEO view)
