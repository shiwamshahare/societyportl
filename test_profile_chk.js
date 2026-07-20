const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iemiodrswxqohbmnhgmi.supabase.co';
const supabaseAnonKey = 'sb_publishable_4gYiixqEVw8pkAg_KDgjcA_WW0JmI4X';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Checking profiles table for user UID: 1d59cd9d-e535-4068-bb4b-8ea010df5eba...");
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', '1d59cd9d-e535-4068-bb4b-8ea010df5eba');

  console.log("Error:", error);
  console.log("Matched rows count:", data ? data.length : 0);
  console.log("Data:", JSON.stringify(data, null, 2));
}

test();
