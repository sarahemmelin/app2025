import { fetchProducts } from "./api.mjs";
import { registerServiceWorker } from "./registerSW.mjs";
import "/components/product-card.mjs";

async function initiateApp() {
    registerServiceWorker();
    const products = await fetchProducts();
    console.log("Produkter:", products);
}

initiateApp();