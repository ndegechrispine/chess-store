const BUSINESS_PHONE = '+254768370394';
const BUSINESS_WHATSAPP = '254768370394';

const SUPABASE_URL = 'https://fhqnmizvmdeofhxodfpm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocW5taXp2bWRlb2ZoeG9kZnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjA2NDYsImV4cCI6MjA5MzEzNjY0Nn0.dE0pClx2Dzwza18PbHKyuZsbWRPvHPebt9HP4wVcrCE';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentProducts = [];

document.addEventListener('DOMContentLoaded', async function() {
    await loadProducts();
    setupEventListeners();
});

async function loadProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error:', error);
        return;
    }
    currentProducts = data;
    renderProducts(data);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    products.forEach(function(product) {
        grid.appendChild(createProductCard(product));
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const hasDiscount = product.sale_price && product.sale_price < product.price;
    const price = hasDiscount ? product.sale_price : product.price;
    
    let html = '<div class="product-image">';
    html += '<img src="' + product.image_url + '" alt="' + product.name + '">';
    if (hasDiscount) {
        html += '<span class="discount-badge">-' + (product.discount_percentage || '') + '%</span>';
    }
    html += '</div>';
    html += '<div class="product-info">';
    html += '<h3 class="product-name">' + product.name + '</h3>';
    html += '<p class="product-description">' + product.description.substring(0, 100) + '...</p>';
    html += '<div class="price-section">';
    if (hasDiscount) {
        html += '<span class="original-price">$' + product.price.toLocaleString() + '</span> ';
        html += '<span class="sale-price">$' + price.toLocaleString() + '</span>';
    } else {
        html += '<span class="regular-price">$' + price.toLocaleString() + '</span>';
    }
    html += '</div>';
    html += '<div class="action-buttons">';
    html += '<button class="whatsapp-btn" onclick="openWhatsApp(\'' + product.name + '\', ' + price + ')"><i class="fab fa-whatsapp"></i> WhatsApp</button>';
    html += '<button class="call-btn" onclick="callNow()"><i class="fas fa-phone"></i> Call</button>';
    html += '</div>';
    html += '<button class="inquire-btn" onclick="openInquiryForm(\'' + product.name + '\', \'' + product.id + '\')"><i class="fas fa-envelope"></i> Send Inquiry</button>';
    html += '</div>';
    
    card.innerHTML = html;
    return card;
}

function openWhatsApp(productName, price) {
    const message = 'Hi! I am interested in the ' + productName + ' ($' + price.toLocaleString() + '). Can you provide more information?';
    window.open('https://wa.me/' + BUSINESS_WHATSAPP + '?text=' + encodeURIComponent(message), '_blank');
}

function callNow() {
    window.location.href = 'tel:' + BUSINESS_PHONE;
}

function openInquiryForm(productName, productId) {
    document.getElementById('productName').value = productName;
    document.getElementById('productId').value = productId;
    document.getElementById('contactModal').style.display = 'block';
}

async function submitInquiry(inquiryData) {
    const { error } = await supabase
        .from('contact_inquiries')
        .insert([inquiryData]);
    if (error) { console.error('Error:', error); return false; }
    return true;
}

function setupEventListeners() {
    document.getElementById('gridView').addEventListener('click', function() {
        document.getElementById('productsGrid').classList.remove('list-view');
    });
    
    document.getElementById('listView').addEventListener('click', function() {
        document.getElementById('productsGrid').classList.add('list-view');
    });
    
    document.getElementById('categoryFilter').addEventListener('change', function(e) {
        var cat = e.target.value;
        var filtered = cat === 'all' ? currentProducts : currentProducts.filter(function(p) { return p.category === cat; });
        renderProducts(filtered);
    });
    
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('contactModal').style.display = 'none';
    });
    
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var data = {
            product_id: document.getElementById('productId').value,
            customer_name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone_number: document.getElementById('phoneNumber').value,
            message: document.getElementById('message').value,
            inquiry_type: 'form'
        };
        var success = await submitInquiry(data);
        if (success) {
            alert('Thank you! We will contact you shortly.');
            document.getElementById('contactModal').style.display = 'none';
        }
    });
}