const BUSINESS_PHONE = '+254768370394';
const BUSINESS_WHATSAPP = '254768370394';

let currentProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    setupEventListeners();
});

async function loadProducts() {
    const products = await fetchProducts();
    currentProducts = products;
    renderProducts(products);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    products.forEach(product => {
        grid.appendChild(createProductCard(product));
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const hasDiscount = product.sale_price && product.sale_price < product.price;
    const price = hasDiscount ? product.sale_price : product.price;
    
    card.innerHTML = '<div class="product-image"><img src="' + product.image_url + '" alt="' + product.name + '">' + (hasDiscount ? '<span class="discount-badge">-' + (product.discount_percentage || '') + '%</span>' : '') + '</div><div class="product-info"><h3 class="product-name">' + product.name + '</h3><p class="product-description">' + product.description.substring(0, 100) + '...</p><div class="price-section">' + (hasDiscount ? '<span class="original-price">$' + product.price.toLocaleString() + '</span> <span class="sale-price">$' + price.toLocaleString() + '</span>' : '<span class="regular-price">$' + price.toLocaleString() + '</span>') + '</div><div class="action-buttons"><button class="whatsapp-btn" onclick="openWhatsApp(\'' + product.name + '\', ' + price + ')"><i class="fab fa-whatsapp"></i> WhatsApp</button><button class="call-btn" onclick="callNow()"><i class="fas fa-phone"></i> Call</button></div><button class="inquire-btn" onclick="openInquiryForm(\'' + product.name + '\', \'' + product.id + '\')"><i class="fas fa-envelope"></i> Send Inquiry</button></div>';
    
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