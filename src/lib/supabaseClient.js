import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://eemhwosqevyokesdlvfr.supabase.co';
const supabasePublishableKey =
    process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_wTay7n3DGx0J5NZHxGV50w_cyHtZLHG';

export const supabase = (supabaseUrl && supabasePublishableKey)
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;