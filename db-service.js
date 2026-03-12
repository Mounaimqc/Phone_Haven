import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    getDoc, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import firebaseConfig from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Cloudinary Image Upload ---

export async function uploadImage(file) {
    if (!file) return null;
    
    const CLOUD_NAME = "dy7bererc";
    const UPLOAD_PRESET = "BladiShop";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        console.log(`Cloudinary: Starting upload for ${file.name}...`);
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Cloudinary upload failed");
        }

        const data = await response.json();
        console.log("Cloudinary: Upload Success, URL:", data.secure_url);
        return data.secure_url; // This is the URL we store in Firestore
    } catch (err) {
        console.error("Cloudinary Error:", err.message);
        throw new Error(`Cloudinary Upload failed: ${err.message}`);
    }
}

// --- Products ---

export async function getProducts() {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProductById(id) {
    const docRef = doc(db, 'products', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
}

export async function addProduct(product) {
    const productsCol = collection(db, 'products');
    const newProduct = {
        ...product,
        createdAt: serverTimestamp()
    };
    return await addDoc(productsCol, newProduct);
}

export async function updateProduct(id, data) {
    const docRef = doc(db, 'products', id);
    return await updateDoc(docRef, data);
}

export async function deleteProduct(id) {
    const docRef = doc(db, 'products', id);
    return await deleteDoc(docRef);
}

// --- Orders ---

export async function getOrders() {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addOrder(order) {
    const ordersCol = collection(db, 'orders');
    const newOrder = {
        ...order,
        createdAt: serverTimestamp(),
        status: 'Pending'
    };
    return await addDoc(ordersCol, newOrder);
}

export async function updateOrder(id, data) {
    const docRef = doc(db, 'orders', id);
    return await updateDoc(docRef, data);
}

export async function getOrderById(id) {
    const docRef = doc(db, 'orders', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
}

export default db;
