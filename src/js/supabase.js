const SUPABASE_URL = 'https://fhqnmizvmdeofhxodfpm.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('Error:', error); return []; }
    return data;
}

async function submitInquiry(inquiryData) {
    const { error } = await supabase
        .from('contact_inquiries')
        .insert([inquiryData]);
    if (error) { console.error('Error:', error); return false; }
    return true;
}