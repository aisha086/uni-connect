import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const getUrl = async function getUrl(bucketName, filePath) {
  
    // Generate the URL
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);
  
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
  
    return data.publicUrl;
  }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

