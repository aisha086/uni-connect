import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const getSignedUrl = async function getSignedUrl(bucketName, filePath) {
    // Set expiry duration (1 year = 31,536,000 seconds)
    const expiry = 31536000;
  
    // Generate the signed URL
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(filePath, expiry);
  
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
  
    return data.signedUrl;
  }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

