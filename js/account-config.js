// Supabase project for real Farther accounts on the public site.
// Paste the two values from Supabase (Project Settings > API) here. Both are safe to
// publish: the anon key only allows what the row level security rules in
// supabase/schema.sql allow, which is each person reading and changing their own data.
// Leave them empty and the site falls back to the preview's claude.ai sign-in, or to
// saving trips in the browser only.
window.TRIPPILOT_SUPABASE = {
  url: "",      // e.g. "https://abcdefghijklmnop.supabase.co"
  anonKey: ""   // the "anon public" key
};
