// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xvnopnyupmpxbjgorlua.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bm9wbnl1cG1weGJqZ29ybHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDMyMjgsImV4cCI6MjA2MDAxOTIyOH0.rmhgouEyHfOtuUBW6OBaMy1jvgxXqJ5nZfkBhdnWydk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);