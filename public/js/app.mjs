import { fetchProducts } from "./api.mjs";
import { registerServiceWorker } from "./registerSW.mjs";

async function initiateApp() {
    registerServiceWorker();
    const products = await fetchProducts();
    console.log("Produkter:", products);
}

initiateApp();