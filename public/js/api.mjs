export async function fetchProducts() {
    try {
        const response = await fetch("/shop/products");
        if (!response.ok) {
            throw new Error(`Feil ved henting av produkter: ${response.status}`);
        }
        const products = await response.json();
        console.log("Produkter hentet:", products);
        return products;
    }
    catch (error) {
        console.error("Feil ved henting av produkter:", error);
        const productsContainer = document.getElementById("products");
        productsContainer.innerHTML = `<p class="error">Kunne ikke hente produkter. Prøv igjen senere.</p>`; 
        return [];
    }
}