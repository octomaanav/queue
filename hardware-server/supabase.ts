import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://ijcorhcaxkyxheioiqti.supabase.co'
const supabaseSecretRole = process.env.SUPABASE_SECRET_ROLE || ''
const supabase = createClient(supabaseUrl, supabaseSecretRole)

export default supabase