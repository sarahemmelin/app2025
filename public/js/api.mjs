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
        return [];
    }
}

async function protectedFetch(url, options = {}) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        console.error("Ingen token funnet! Brukeren er ikke logget inn.");
        return;
    }

    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    return fetch(url, options);
}

export async function addProduct(productData) {
    const response = await protectedFetch("/shop/", {
        method: "POST",
        body: JSON.stringify(productData)
    });

    return response.json();
}

export async function deleteProduct(productId) {
    const response = await protectedFetch(`/shop/${productId}`, {
        method: "DELETE"
    });

    return response.json();
}

// export async function fetchProducts() {
//     try {
//         const response = await fetch("/shop/products");
//         if (!response.ok) {
//             throw new Error(`Feil ved henting av produkter: ${response.status}`);
//         }
//         const products = await response.json();
//         console.log("Produkter hentet:", products);
//         return products;
//     }
//     catch (error) {
//         console.error("Feil ved henting av produkter:", error);
//         const productsContainer = document.getElementById("products");
//         productsContainer.innerHTML = `<p class="error">Kunne ikke hente produkter. Prøv igjen senere.</p>`; 
//         return [];
//     }
// }