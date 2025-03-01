import { fetchProducts } from "./api.mjs";


async function initiateApp() {
    const products = await fetchProducts();
    console.log("Produkter:", products);
}


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceWorker.js")
        .then(() => console.log("Service Worker registrert!"))
        .catch(error => console.error("Service Worker-feil:", error));
}

initiateApp();