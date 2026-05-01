const SUPABASE_URL = 'https://fhqnmizvmdeofhxodfpm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocW5taXp2bWRlb2ZoeG9kZnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjA2NDYsImV4cCI6MjA5MzEzNjY0Nn0.dE0pClx2Dzwza18PbHKyuZsbWRPvHPebt9HP4wVcrCE';

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