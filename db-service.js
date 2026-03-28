/**
 * Phone Haven - Database Service
 * Firebase Firestore + Cloudinary Integration
 * @version 2.0.0
 */

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    limit,
    startAfter,
    serverTimestamp,
    runTransaction,
    increment,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

// ============================================
// 🛠️ UTILITY FUNCTIONS
// ============================================

/**
 * Convert Firestore timestamp to JavaScript Date
 * @param {any} timestamp - Firestore Timestamp or ISO string
 * @returns {Date|null}
 */
export function toDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp instanceof Timestamp) return timestamp.toDate();
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string') return new Date(timestamp);
    return null;
}

/**
 * Format price with Algerian Dinar
 * @param {number} price 
 * @returns {string}
 */
export function formatPrice(price) {
    return new Intl.NumberFormat('fr-DZ').format(price || 0) + ' د.ج';
}

/**
 * Generate unique order ID: PH-YYYY-XXXXX
 * @returns {string}
 */
export function generateOrderId() {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `PH-${year}-${random}`;
}

/**
 * Debounce function for search inputs
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// ☁️ CLOUDINARY IMAGE UPLOAD
// ============================================

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
export async function uploadImage(file, folder = 'phone-haven') {
    if (!file) return null;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        throw new Error('Format d\'image non supporté. Utilisez JPG, PNG ou WebP.');
    }
    if (file.size > maxSize) {
        throw new Error('L\'image est trop lourde. Maximum 5Mo.');
    }

    const CLOUD_NAME = "dy7bererc";
    const UPLOAD_PRESET = "BladiShop";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    try {
        console.log(`☁️ Cloudinary: Upload de ${file.name}...`);
        
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Cloudinary: Upload réussi:", data.secure_url);
        return data.secure_url;
        
    } catch (err) {
        console.error("❌ Cloudinary Error:", err.message);
        throw new Error(`Échec de l'upload: ${err.message}`);
    }
}

/**
 * Delete image from Cloudinary (requires API key/secret - server-side recommended)
 * @param {string} imageUrl - Full Cloudinary URL
 * @returns {Promise<boolean>}
 */
export async function deleteImage(imageUrl) {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) return false;
    
    try {
        // Extract public_id from URL: https://res.cloudinary.com/XXX/image/upload/v123/folder/name.jpg
        const urlParts = imageUrl.split('/upload/');
        if (urlParts.length < 2) return false;
        
        const pathPart = urlParts[1];
        const publicId = pathPart.replace(/\.[^/.]+$/, "").split('/').slice(1).join('/');
        
        // ⚠️ This requires server-side implementation with API key/secret
        // For client-side, consider using Cloudinary Upload Widget with delete permissions
        console.warn("🔐 Suppression d'image nécessite une implémentation serveur");
        return false;
        
    } catch (err) {
        console.error("❌ Delete image error:", err);
        return false;
    }
}

// ============================================
// 📦 PRODUCTS SERVICE
// ============================================

/**
 * Get all products with optional filters
 * @param {Object} options - Filter options
 * @param {string} [options.category] - Filter by category
 * @param {number} [options.minPrice] - Minimum price
 * @param {number} [options.maxPrice] - Maximum price
 * @param {string} [options.search] - Search in name/description
 * @param {number} [options.limit] - Max results (default: 50)
 * @returns {Promise<Array>}
 */
export async function getProducts({ 
    category = null, 
    minPrice = null, 
    maxPrice = null, 
    search = null,
    limitCount = 50 
} = {}) {
    try {
        const productsCol = collection(db, 'products');
        let q = query(productsCol, orderBy('createdAt', 'desc'));
        
        // Apply filters
        if (category && category !== 'All' && category !== 'Offres') {
            q = query(q, where('category', '==', category));
        }
        
        if (minPrice !== null) {
            q = query(q, where('price', '>=', minPrice));
        }
        
        if (maxPrice !== null) {
            q = query(q, where('price', '<=', maxPrice));
        }
        
        // Note: Full-text search requires Firestore indexes or Algolia
        // For now, we fetch and filter client-side if search is provided
        
        q = query(q, limit(limitCount));
        const snapshot = await getDocs(q);
        
        let products = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: toDate(doc.data().createdAt)
        }));
        
        // Client-side search filter
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p => 
                p.name?.toLowerCase().includes(searchLower) || 
                p.description?.toLowerCase().includes(searchLower)
            );
        }
        
        // Filter "Offres" category (discount or price < 50000)
        if (category === 'Offres') {
            products = products.filter(p => p.discount === true || p.price < 50000);
        }
        
        return products;
        
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        throw new Error(`Impossible de charger les produits: ${error.message}`);
    }
}

/**
 * Get product by ID
 * @param {string} id - Product document ID
 * @returns {Promise<Object|null>}
 */
export async function getProductById(id) {
    try {
        const docRef = doc(db, 'products', id);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
            const data = snapshot.data();
            return { 
                id: snapshot.id, 
                ...data,
                createdAt: toDate(data.createdAt),
                updatedAt: toDate(data.updatedAt)
            };
        }
        return null;
        
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        throw new Error(`Produit non trouvé: ${error.message}`);
    }
}

/**
 * Add new product
 * @param {Object} product - Product data
 * @returns {Promise<string>} - New document ID
 */
export async function addProduct(product) {
    try {
        const productsCol = collection(db, 'products');
        const newProduct = {
            ...product,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            sold: product.sold || 0,
            views: product.views || 0,
            rating: product.rating || 0,
            reviews: product.reviews || 0
        };
        
        const docRef = await addDoc(productsCol, newProduct);
        console.log("✅ Product added:", docRef.id);
        return docRef.id;
        
    } catch (error) {
        console.error("❌ Error adding product:", error);
        throw new Error(`Échec de l'ajout: ${error.message}`);
    }
}

/**
 * Update product by ID
 * @param {string} id - Product document ID
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export async function updateProduct(id, data) {
    try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        console.log("✅ Product updated:", id);
        
    } catch (error) {
        console.error("❌ Error updating product:", error);
        throw new Error(`Échec de la mise à jour: ${error.message}`);
    }
}

/**
 * Update product stock (atomic operation)
 * @param {string} id - Product document ID
 * @param {number} quantity - Quantity to add (negative to subtract)
 * @returns {Promise<void>}
 */
export async function updateProductStock(id, quantity) {
    try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, {
            stock: increment(quantity),
            updatedAt: serverTimestamp()
        });
        console.log(`✅ Stock updated: ${id} (${quantity >= 0 ? '+' : ''}${quantity})`);
        
    } catch (error) {
        console.error("❌ Error updating stock:", error);
        throw new Error(`Échec mise à jour stock: ${error.message}`);
    }
}

/**
 * Delete product
 * @param {string} id - Product document ID
 * @returns {Promise<void>}
 */
export async function deleteProduct(id) {
    try {
        // ⚠️ Consider soft delete instead of hard delete
        const docRef = doc(db, 'products', id);
        await deleteDoc(docRef);
        console.log("✅ Product deleted:", id);
        
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        throw new Error(`Échec de la suppression: ${error.message}`);
    }
}

/**
 * Search products (debounced)
 * @param {string} searchTerm - Search query
 * @param {number} debounceMs - Debounce delay in ms
 * @returns {Promise<Function>} - Debounced search function
 */
export function createProductSearch(debounceMs = 300) {
    return debounce(async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
            return await getProducts({ limitCount: 20 });
        }
        return await getProducts({ search: searchTerm, limitCount: 20 });
    }, debounceMs);
}

// ============================================
// 🛒 ORDERS SERVICE
// ============================================

/**
 * Get all orders with optional filters
 * @param {Object} options - Filter options
 * @param {string} [options.status] - Filter by order status
 * @param {string} [options.customerPhone] - Filter by customer phone
 * @param {number} [options.limit] - Max results (default: 50)
 * @returns {Promise<Array>}
 */
export async function getOrders({ 
    status = null, 
    customerPhone = null, 
    limitCount = 50 
} = {}) {
    try {
        const ordersCol = collection(db, 'orders');
        let q = query(ordersCol, orderBy('createdAt', 'desc'));
        
        if (status) {
            q = query(q, where('status', '==', status));
        }
        
        if (customerPhone) {
            q = query(q, where('customerPhone', '==', customerPhone));
        }
        
        q = query(q, limit(limitCount));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: toDate(doc.data().createdAt),
            deliveredAt: toDate(doc.data().deliveredAt)
        }));
        
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        throw new Error(`Impossible de charger les commandes: ${error.message}`);
    }
}

/**
 * Get order by ID
 * @param {string} id - Order document ID or order number
 * @returns {Promise<Object|null>}
 */
export async function getOrderById(id) {
    try {
        // First try direct document lookup (if id is Firestore doc ID)
        let docRef = doc(db, 'orders', id);
        let snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
            const data = snapshot.data();
            return { 
                id: snapshot.id, 
                ...data,
                createdAt: toDate(data.createdAt)
            };
        }
        
        // If not found, search by orderNumber field
        const ordersCol = collection(db, 'orders');
        const q = query(ordersCol, where('orderNumber', '==', id), limit(1));
        const searchSnapshot = await getDocs(q);
        
        if (!searchSnapshot.empty) {
            const doc = searchSnapshot.docs[0];
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                createdAt: toDate(data.createdAt)
            };
        }
        
        return null;
        
    } catch (error) {
        console.error("❌ Error fetching order:", error);
        throw new Error(`Commande non trouvée: ${error.message}`);
    }
}

/**
 * Create new order
 * @param {Object} order - Order data
 * @returns {Promise<Object>} - Created order with ID
 */
export async function addOrder(order) {
    try {
        const ordersCol = collection(db, 'orders');
        
        // Generate order number if not provided
        const orderNumber = order.orderNumber || generateOrderId();
        
        const newOrder = {
            ...order,
            orderNumber,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: order.status || 'Pending',
            paymentMethod: order.paymentMethod || 'cash_on_delivery',
            total: order.total || 0,
            quantity: order.quantity || 1
        };
        
        // Use transaction to ensure atomicity if updating product stock
        const docRef = await addDoc(ordersCol, newOrder);
        
        // If product ID provided, update stock
        if (order.productId) {
            await updateProductStock(order.productId, -newOrder.quantity);
        }
        
        console.log("✅ Order created:", { id: docRef.id, orderNumber });
        return { id: docRef.id, ...newOrder, orderNumber };
        
    } catch (error) {
        console.error("❌ Error creating order:", error);
        throw new Error(`Échec de la commande: ${error.message}`);
    }
}

/**
 * Update order status and data
 * @param {string} id - Order document ID
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export async function updateOrder(id, data) {
    try {
        const docRef = doc(db, 'orders', id);
        
        // If status is changing to 'Delivered', add deliveredAt timestamp
        const updateData = {
            ...data,
            updatedAt: serverTimestamp()
        };
        
        if (data.status === 'Delivered' && !data.deliveredAt) {
            updateData.deliveredAt = serverTimestamp();
        }
        
        await updateDoc(docRef, updateData);
        console.log("✅ Order updated:", id);
        
    } catch (error) {
        console.error("❌ Error updating order:", error);
        throw new Error(`Échec de la mise à jour: ${error.message}`);
    }
}

/**
 * Cancel order (with stock restoration)
 * @param {string} id - Order document ID
 * @returns {Promise<void>}
 */
export async function cancelOrder(id) {
    try {
        // Use transaction for atomic update
        await runTransaction(db, async (transaction) => {
            const docRef = doc(db, 'orders', id);
            const docSnap = await transaction.get(docRef);
            
            if (!docSnap.exists()) {
                throw new Error("Commande non trouvée");
            }
            
            const order = docSnap.data();
            
            // Restore product stock
            if (order.productId && order.quantity) {
                const productRef = doc(db, 'products', order.productId);
                transaction.update(productRef, {
                    stock: increment(order.quantity),
                    updatedAt: serverTimestamp()
                });
            }
            
            // Update order status
            transaction.update(docRef, {
                status: 'Cancelled',
                cancelledAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        });
        
        console.log("✅ Order cancelled:", id);
        
    } catch (error) {
        console.error("❌ Error cancelling order:", error);
        throw new Error(`Échec d'annulation: ${error.message}`);
    }
}

/**
 * Get orders by customer phone
 * @param {string} phone - Customer phone number
 * @returns {Promise<Array>}
 */
export async function getOrdersByPhone(phone) {
    try {
        const ordersCol = collection(db, 'orders');
        const q = query(
            ordersCol, 
            where('customerPhone', '==', phone),
            orderBy('createdAt', 'desc'),
            limit(20)
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: toDate(doc.data().createdAt)
        }));
        
    } catch (error) {
        console.error("❌ Error fetching customer orders:", error);
        return [];
    }
}

// ============================================
// 📊 ANALYTICS SERVICE
// ============================================

/**
 * Get analytics data for dashboard
 * @param {Object} options - Analytics options
 * @param {number} [options.days] - Number of days to analyze (default: 30)
 * @returns {Promise<Object>}
 */
export async function getAnalytics({ days = 30 } = {}) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Fetch orders for the period
        const ordersCol = collection(db, 'orders');
        // Note: For date range queries, you need a composite index on (createdAt, status)
        const q = query(
            ordersCol, 
            orderBy('createdAt', 'desc'),
            limit(500) // Adjust based on expected volume
        );
        const snapshot = await getDocs(q);
        
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: toDate(doc.data().createdAt)
        }));
        
        // Filter by date range (client-side since Firestore doesn't support date range without index)
        const filteredOrders = orders.filter(o => {
            const orderDate = o.createdAt;
            return orderDate && orderDate >= startDate && orderDate <= endDate;
        });
        
        // Calculate metrics
        const totalRevenue = filteredOrders
            .filter(o => o.status !== 'Cancelled')
            .reduce((sum, o) => sum + (o.total || 0), 0);
            
        const totalOrders = filteredOrders.length;
        const deliveredOrders = filteredOrders.filter(o => o.status === 'Delivered').length;
        
        // Calculate previous period for comparison
        const prevStartDate = new Date(startDate);
        prevStartDate.setDate(prevStartDate.getDate() - days);
        const prevOrders = orders.filter(o => {
            const orderDate = o.createdAt;
            return orderDate && orderDate >= prevStartDate && orderDate < startDate;
        });
        
        const prevRevenue = prevOrders
            .filter(o => o.status !== 'Cancelled')
            .reduce((sum, o) => sum + (o.total || 0), 0);
        
        // Revenue by period (for chart)
        const revenueByPeriod = calculatePeriodData(filteredOrders, 'day');
        
        // Category distribution
        const categoryDistribution = calculateCategoryData(filteredOrders);
        
        // Fetch product stats
        const products = await getProducts({ limitCount: 100 });
        const totalProducts = products.length;
        const lowStockProducts = products.filter(p => (p.stock || 0) < 10).length;
        
        return {
            // Summary metrics
            totalRevenue: Math.round(totalRevenue),
            totalOrders,
            deliveredOrders,
            totalProducts,
            lowStockProducts,
            avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
            
            // Changes vs previous period
            revenueChange: prevRevenue > 0 ? 
                Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) : null,
            ordersChange: prevOrders.length > 0 ? 
                Math.round(((totalOrders - prevOrders.length) / prevOrders.length) * 100) : null,
            
            // Chart data
            revenueByPeriod,
            categoryDistribution,
            
            // Period info
            period: {
                start: startDate,
                end: endDate,
                days
            }
        };
        
    } catch (error) {
        console.error("❌ Error fetching analytics:", error);
        // Return empty analytics structure on error
        return {
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0,
            avgOrderValue: 0,
            revenueChange: null,
            ordersChange: null,
            revenueByPeriod: [],
            categoryDistribution: [],
            period: { days }
        };
    }
}

/**
 * Calculate revenue by period (day/week/month)
 * @private
 */
function calculatePeriodData(orders, periodType = 'day') {
    const data = {};
    const now = new Date();
    
    // Initialize periods for last 7 days / 4 weeks / 12 months
    const periods = periodType === 'day' ? 7 : periodType === 'week' ? 4 : 12;
    
    for (let i = periods - 1; i >= 0; i--) {
        const date = new Date(now);
        if (periodType === 'day') {
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
        } else if (periodType === 'week') {
            date.setDate(date.getDate() - (i * 7));
        } else {
            date.setMonth(date.getMonth() - i);
        }
        
        const key = periodType === 'day' ? date.toLocaleDateString('fr-FR', { weekday: 'short' }) :
                   periodType === 'week' ? `S${Math.ceil(date.getDate() / 7)}` :
                   date.toLocaleDateString('fr-FR', { month: 'short' });
        
        data[key] = { label: key, value: 0, isCurrent: i === 0 };
    }
    
    // Aggregate orders
    orders.forEach(order => {
        if (order.status === 'Cancelled' || !order.createdAt) return;
        
        const orderDate = order.createdAt;
        let key;
        
        if (periodType === 'day') {
            key = orderDate.toLocaleDateString('fr-FR', { weekday: 'short' });
        } else if (periodType === 'week') {
            key = `S${Math.ceil(orderDate.getDate() / 7)}`;
        } else {
            key = orderDate.toLocaleDateString('fr-FR', { month: 'short' });
        }
        
        if (data[key]) {
            data[key].value += order.total || 0;
        }
    });
    
    return Object.values(data).map(d => ({ ...d, value: Math.round(d.value) }));
}

/**
 * Calculate category distribution from orders
 * @private
 */
function calculateCategoryData(orders) {
    const categories = {};
    
    orders.forEach(order => {
        if (order.status === 'Cancelled' || !order.category) return;
        
        const cat = order.category;
        if (!categories[cat]) {
            categories[cat] = { name: cat, value: 0 };
        }
        categories[cat].value += order.total || 0;
    });
    
    return Object.values(categories)
        .sort((a, b) => b.value - a.value)
        .map(c => ({ ...c, value: Math.round(c.value) }));
}

/**
 * Get top performing products
 * @param {number} limit - Number of products to return
 * @returns {Promise<Array>}
 */
export async function getTopProducts(limit = 10) {
    try {
        const products = await getProducts({ limitCount: 100 });
        
        return products
            .map(p => ({
                ...p,
                revenue: (p.price || 0) * (p.sold || 0)
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, limit);
            
    } catch (error) {
        console.error("❌ Error fetching top products:", error);
        return [];
    }
}

/**
 * Get low stock alerts
 * @param {number} threshold - Stock level to trigger alert
 * @returns {Promise<Array>}
 */
export async function getLowStockProducts(threshold = 10) {
    try {
        const products = await getProducts({ limitCount: 200 });
        return products
            .filter(p => (p.stock || 0) <= threshold)
            .sort((a, b) => (a.stock || 0) - (b.stock || 0));
    } catch (error) {
        console.error("❌ Error fetching low stock:", error);
        return [];
    }
}

// ============================================
// 🔐 AUTH HELPERS (Optional)
// ============================================

/**
 * Check if user is authenticated (for admin pages)
 * @returns {boolean}
 */
export function isAdminAuthenticated() {
    const token = localStorage.getItem('admin_token');
    const expiry = localStorage.getItem('admin_token_expiry');
    
    if (!token || !expiry) return false;
    if (Date.now() > parseInt(expiry)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token_expiry');
        return false;
    }
    return true;
}

/**
 * Set admin auth token
 * @param {string} token 
 * @param {number} expiresInMs - Token validity in milliseconds
 */
export function setAdminAuth(token, expiresInMs = 24 * 60 * 60 * 1000) {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_token_expiry', (Date.now() + expiresInMs).toString());
}

/**
 * Clear admin auth
 */
export function clearAdminAuth() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
    localStorage.removeItem('admin_name');
}

// ============================================
// 📤 EXPORT DEFAULT
// ============================================

export default {
    // Products
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
    createProductSearch,
    
    // Orders
    getOrders,
    getOrderById,
    addOrder,
    updateOrder,
    cancelOrder,
    getOrdersByPhone,
    
    // Analytics
    getAnalytics,
    getTopProducts,
    getLowStockProducts,
    
    // Utilities
    uploadImage,
    deleteImage,
    toDate,
    formatPrice,
    generateOrderId,
    
    // Auth
    isAdminAuthenticated,
    setAdminAuth,
    clearAdminAuth,
    
    // Firebase
    db
};
