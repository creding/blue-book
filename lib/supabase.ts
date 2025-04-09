import { createClient } from "@supabase/supabase-js"
import type { DevotionalView } from "@/types/devotional"

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type for the database response
export type DevotionalRecord = DevotionalView
