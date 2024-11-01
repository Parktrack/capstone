// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'https://tsssbpoccxrodluggijk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc3NicG9jY3hyb2RsdWdnaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MzI2MzEsImV4cCI6MjA0NDEwODYzMX0.BHO9C3T53jmMx7RtSKI4ouU_MxPBukxKzDAouPJxbLo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
