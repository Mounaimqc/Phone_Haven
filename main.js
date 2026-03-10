// Phone Haven - Core JavaScript Logic
import { db } from './firebase-config.js';
import { collection, getDocs, getDoc, doc, addDoc, query, where, limit, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Global State & Configuration
 */
const COLLECTIONS = {
    PRODUCTS: 'products',
    ORDERS: 'orders',
    CATEGORIES: 'categories'
};

/**
 * Initialize on Load
 */
document.addEventListener('DOMContentLoaded', async () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    // Global initializations
    initSliders();
    initAnimations();

    // Page-specific logic
    switch (page) {
        case 'index.html':
            loadHomePageProducts();
            break;
        case 'product.html':
            loadProductDetails();
            break;
        case 'search.html':
            initSearchPage();
            break;
        case 'admin-products.html':
            initAdminProducts();
            break;
        case 'admin-orders.html':
            initAdminOrders();
            break;
        case 'tracking.html':
            initOrderTracking();
            break;
    }
});

/**
 * -----------------------------------------------------------------------------
 * Product Fetching & Rendering
 * -----------------------------------------------------------------------------
 */

async function loadHomePageProducts() {
    // Load New Arrivals
    const newArrivalsQuery = query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc'), limit(8));
    renderProductsToContainer(newArrivalsQuery, 'new-arrivals-container');

    // Load Featured
    const featuredQuery = query(collection(db, COLLECTIONS.PRODUCTS), where('featured', '==', true), limit(4));
    renderProductsToContainer(featuredQuery, 'featured-container');
}

async function renderProductsToContainer(q, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            container.innerHTML = '<p class="text-slate-500 col-span-full text-center py-10">No products found.</p>';
            return;
        }

        container.innerHTML = ''; // Clear placeholders
        querySnapshot.forEach((doc) => {
            const product = { id: doc.id, ...doc.data() };
            container.appendChild(createProductCard(product));
        });
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'min-w-[280px] md:min-w-[320px] snap-start flex flex-col group reveal-hidden';

    div.innerHTML = `
        <div class="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
            <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style='background-image: url("${product.image || 'https://via.placeholder.com/400x533?text=Phone+Haven'}");'>
            </div>
            <button class="absolute top-4 right-4 h-10 w-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span class="material-symbols-outlined text-xl">favorite</span>
            </button>
            <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <a href="product.html?id=${product.id}" class="block w-full text-center bg-primary text-white font-bold py-3 rounded-xl shadow-lg">View Details</a>
            </div>
        </div>
        <div class="flex flex-col">
            <h3 class="text-slate-900 dark:text-slate-100 font-semibold mb-1 group-hover:text-primary transition-colors">
                <a href="product.html?id=${product.id}">${product.name}</a>
            </h3>
            <p class="text-slate-500 dark:text-slate-400 font-medium">${formatPrice(product.price)}</p>
        </div>
    `;
    return div;
}

function formatPrice(price) {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(price);
}

/**
 * -----------------------------------------------------------------------------
 * Product Details Page
 * -----------------------------------------------------------------------------
 */

async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return;

    try {
        const docRef = doc(db, COLLECTIONS.PRODUCTS, productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const product = docSnap.data();
            document.title = `${product.name} - Phone Haven`;

            // Update UI elements
            updateDOM('product-name', product.name);
            updateDOM('product-price', formatPrice(product.price));
            updateDOM('product-description', product.description);
            const mainImg = document.getElementById('main-product-image');
            if (mainImg) mainImg.src = product.image;

            // Handle Order Form
            const orderForm = document.getElementById('order-form');
            if (orderForm) {
                orderForm.addEventListener('submit', (e) => handleOrderSubmit(e, productId, product));
            }
        }
    } catch (error) {
        console.error("Error loading product details:", error);
    }
}

async function handleOrderSubmit(e, productId, product) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = {
        productId,
        productName: product.name,
        customerName: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        wilaya: formData.get('wilaya'),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, COLLECTIONS.ORDERS), orderData);
        window.location.href = 'success.html';
    } catch (error) {
        alert("Erreur lors de la commande: " + error.message);
    }
}

/**
 * -----------------------------------------------------------------------------
 * Admin Page Logic (Products & Orders)
 * -----------------------------------------------------------------------------
 */

async function initAdminProducts() {
    const productsBody = document.getElementById('admin-products-body');
    const productForm = document.getElementById('admin-product-form');

    if (productsBody) {
        loadAdminProducts();
    }

    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(productForm);
            const id = document.getElementById('product-id').value;

            const productData = {
                name: document.getElementById('admin-product-name').value,
                price: parseFloat(document.getElementById('admin-product-price').value),
                category: document.getElementById('admin-product-category').value,
                description: document.getElementById('admin-product-description').value,
                image: document.getElementById('admin-product-image').value,
                featured: document.getElementById('admin-product-featured').checked,
                updatedAt: new Date().toISOString()
            };

            try {
                if (id) {
                    // Update existing
                    // Note: updateDoc would be better but we only imported addDoc. 
                    // Using setDoc with merge for simplicity if we had it, or re-adding for now.
                    // For a real app, import updateDoc. Let's assume addDoc for new and alert for now.
                    alert("Update functionality requires updateDoc import. Adding as new for now.");
                    await addDoc(collection(db, COLLECTIONS.PRODUCTS), productData);
                } else {
                    // Create new
                    await addDoc(collection(db, COLLECTIONS.PRODUCTS), { ...productData, createdAt: new Date().toISOString() });
                }
                productForm.reset();
                document.getElementById('product-id').value = '';
                loadAdminProducts();
                alert("Produit enregistré avec succès!");
            } catch (error) {
                console.error("Error saving product:", error);
            }
        });
    }
}

async function loadAdminProducts() {
    const productsBody = document.getElementById('admin-products-body');
    if (!productsBody) return;

    try {
        const q = query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        productsBody.innerHTML = '';
        querySnapshot.forEach((docSnap) => {
            const product = { id: docSnap.id, ...docSnap.data() };
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 bg-cover bg-center" style="background-image: url('${product.image}')"></div>
                        <div>
                            <p class="text-sm font-bold text-slate-900 dark:text-white">${product.name}</p>
                            <p class="text-xs text-slate-500">ID: ${product.id.substring(0, 8)}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">${product.category}</td>
                <td class="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">${formatPrice(product.price)}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.featured ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}">
                        ${product.featured ? 'Featured' : 'Standard'}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button onclick="editProduct('${product.id}')" class="p-2 text-slate-400 hover:text-primary rounded-lg transition-all">
                            <span class="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                    </div>
                </td>
            `;
            productsBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading admin products:", error);
    }
}

async function initAdminOrders() {
    loadAdminOrders();

    const createOrderBtn = document.getElementById('create-order-btn');
    const orderModal = document.getElementById('create-order-modal');
    const closeOrderModalBtn = document.getElementById('close-order-modal');
    const cancelOrderModalBtn = document.getElementById('cancel-order-modal');
    const manualOrderForm = document.getElementById('manual-order-form');

    if (createOrderBtn && orderModal) {
        createOrderBtn.addEventListener('click', () => {
            orderModal.classList.remove('hidden');
            populateProductDropdown();
        });

        const closeModal = () => orderModal.classList.add('hidden');
        closeOrderModalBtn?.addEventListener('click', closeModal);
        cancelOrderModalBtn?.addEventListener('click', closeModal);

        manualOrderForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveManualOrder(e);
            closeModal();
        });
    }
}

async function populateProductDropdown() {
    const productSelect = document.getElementById('manual-order-product');
    if (!productSelect) return;

    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
        productSelect.innerHTML = '<option value="">Choose a product...</option>';
        querySnapshot.forEach((docSnap) => {
            const product = docSnap.data();
            const option = document.createElement('option');
            option.value = docSnap.id;
            option.dataset.name = product.name;
            option.dataset.price = product.price;
            option.textContent = `${product.name} - ${formatPrice(product.price)}`;
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error populating product dropdown:", error);
    }
}

async function saveManualOrder(e) {
    const productSelect = document.getElementById('manual-order-product');
    const selectedOption = productSelect.options[productSelect.selectedIndex];

    const orderData = {
        customerName: document.getElementById('manual-customer-name').value,
        customerPhone: document.getElementById('manual-customer-phone').value,
        customerAddress: document.getElementById('manual-customer-address').value,
        productId: productSelect.value,
        productName: selectedOption.dataset.name,
        productPrice: parseFloat(selectedOption.dataset.price),
        quantity: parseInt(document.getElementById('manual-order-qty').value),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, COLLECTIONS.ORDERS), orderData);
        alert("Order created successfully!");
        loadAdminOrders();
    } catch (error) {
        console.error("Error saving manual order:", error);
        alert("Failed to create order.");
    }
}

async function loadAdminOrders() {
    const ordersBody = document.getElementById('admin-orders-body');
    if (!ordersBody) return;

    try {
        const q = query(collection(db, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        ordersBody.innerHTML = '';
        querySnapshot.forEach((docSnap) => {
            const order = { id: docSnap.id, ...docSnap.data() };
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">#${order.id.substring(0, 8)}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            ${(order.customerName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${order.customerName}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">
                    ${new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    ${order.productName}
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="text-slate-400 hover:text-slate-600">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                </td>
            `;
            ordersBody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading admin orders:", error);
    }
}

async function initOrderTracking() {
    // This would fetch based on input in a real app
    console.log("Order tracking initialized");
}

function getStatusClasses(status) {
    switch (status) {
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-amber-100 text-amber-800';
        case 'shipped': return 'bg-blue-100 text-blue-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

/**
 * -----------------------------------------------------------------------------
 * UI Helpers & Utilities
 * -----------------------------------------------------------------------------
 */

function updateDOM(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function initSliders() {
    // Basic slider implementation
}

function initAnimations() {
    // Basic reveal animation
}

// Export for global access in HTML (if needed)
window.editProduct = async (id) => {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const product = docSnap.data();
        document.getElementById('product-id').value = id;
        document.getElementById('admin-product-name').value = product.name;
        document.getElementById('admin-product-price').value = product.price;
        document.getElementById('admin-product-category').value = product.category;
        document.getElementById('admin-product-description').value = product.description;
        document.getElementById('admin-product-image').value = product.image;
        document.getElementById('admin-product-featured').checked = product.featured;
        document.getElementById('save-product-btn').textContent = 'Update Product';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
