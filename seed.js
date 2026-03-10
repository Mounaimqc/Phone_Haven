
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const sampleProducts = [
    {
        name: "iPhone 15 Pro",
        price: 185000,
        description: "The latest flagship from Apple with Titanium design and A17 Pro chip.",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800",
        category: "smartphones",
        featured: true,
        createdAt: serverTimestamp()
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        price: 195000,
        description: "Experience the power of AI with the new Galaxy S24 Ultra.",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
        category: "smartphones",
        featured: true,
        createdAt: serverTimestamp()
    },
    {
        name: "AirPods Pro (2nd Gen)",
        price: 35000,
        description: "Up to 2x more Active Noise Cancellation for immersive sound.",
        image: "https://images.unsplash.com/photo-1588423770674-f2855ee82639?auto=format&fit=crop&q=80&w=800",
        category: "audio",
        featured: false,
        createdAt: serverTimestamp()
    },
    {
        name: "MagSafe Charger",
        price: 8500,
        description: "Official Apple MagSafe Charger for fast wireless charging.",
        image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&q=80&w=800",
        category: "accessories",
        featured: false,
        createdAt: serverTimestamp()
    },
    {
        name: "Leather Case for iPhone 15",
        price: 12000,
        description: "Premium leather case with MagSafe support.",
        image: "https://images.unsplash.com/photo-1603313011101-31c726a54881?auto=format&fit=crop&q=80&w=800",
        category: "accessories",
        featured: false,
        createdAt: serverTimestamp()
    }
];

async function seedProducts() {
    console.log("Starting to seed products...");
    for (const product of sampleProducts) {
        try {
            const docRef = await addDoc(collection(db, "products"), product);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    console.log("Seeding complete!");
}

// Check if we are in a browser environment to run it once
if (typeof window !== 'undefined') {
    // We can expose it to the console for the user to run or run it once
    window.seedProducts = seedProducts;
    console.log("Type 'seedProducts()' in the console to populate the database.");
}
