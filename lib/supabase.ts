import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gsatyyvkaxcwzdsbyolp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzYXR5eXZrYXhjd3pkc2J5b2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTM2NjYsImV4cCI6MjA3OTc4OTY2Nn0.NH-45qp-zDfx_A2E_ivioHt_EBA0ymA6VU5q8bypkfY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
