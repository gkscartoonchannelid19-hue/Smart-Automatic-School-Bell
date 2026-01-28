import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Support both ANON key and the newer PUBLISHABLE_DEFAULT_KEY name
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // In development or when Supabase isn't configured, we log a warning once.
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL or a public Supabase key env var is not set. Falling back to local-only storage."
    )
  }
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

