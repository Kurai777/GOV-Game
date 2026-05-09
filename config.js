// ============================================================
// Governance Challenge — Supabase config
// ============================================================
// Fill these in after running supabase-schema.sql.
//   1. Go to your Supabase project → Settings → API
//   2. Copy "Project URL"     → SUPABASE_URL below
//   3. Copy the "anon public" → SUPABASE_ANON_KEY below
//
// Both values are SAFE to commit / expose in the browser. The anon key
// only allows execution of the whitelisted RPCs defined in the schema.
// Never paste the "service_role" key here — that one is admin and would
// bypass all security.
// ============================================================

window.GC_CONFIG = {
  SUPABASE_URL:      "https://xpdwdjitdakavmfsqzmw.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwZHdkaml0ZGFrYXZtZnNxem13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNjI4MjAsImV4cCI6MjA5MzgzODgyMH0.2a62Cizl2mp7v0IOYEYdKWpnjYh9ovboLQJslh3ixOE",
};
