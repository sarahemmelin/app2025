export async function fetchProducts() {
    try {
        const response = await fetch("/products");
        if (!response.ok) {
            throw new Error(`Feil ved henting av produkter: ${response.status}`);
        }
        const products = await response.json();
        return products;
    }
    catch (error) {
        console.error("Feil ved henting av produkter:", error);
        return [];
    }
}

async function protectedFetch(url, options = {}) {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
        console.error("Ingen token funnet! Brukeren er ikke logget inn.");
        return;
    }

    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    console.warn("Token som sendes i header:", token);
    return fetch(url, options);
}

export async function addProduct(productData) {
    console.log("[DEBUG api] Sender produktdata:", productData);
    const response = await protectedFetch("/products", {
        method: "POST",
        body: JSON.stringify(productData)
    });

    if (!response.ok) {
        throw new Error(`Feil ved lagring av produkt: ${response.status}`);
        return null;
    }

    const jsonResponse = await response.json();
    console.log("[DEBUG api] Respons fra server:", jsonResponse);
    return jsonResponse;
}

export async function deleteProduct(productId) {
    const response = await protectedFetch(`/products/${productId}`, {
        method: "DELETE"
    });

    return response.json();
}
