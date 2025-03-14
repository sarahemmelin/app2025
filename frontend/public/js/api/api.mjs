const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    PUT: "PUT",
    DELETE: "DELETE"
};

const BASE_API = "/api";

const API_ENDPOINTS = {
    login: () => `${BASE_API}/login`,
    products: () => `${BASE_API}/products`,
    productById: (id) => `${BASE_API}/products/${id}`
};

async function apiRequest(endpoint, method = HTTP_METHODS.GET, data = null) {
    const requestConfig = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if ([HTTP_METHODS.POST, HTTP_METHODS.PATCH, HTTP_METHODS.PUT].includes(method) && data) {
        requestConfig.body = JSON.stringify(data);
    }

    const token = sessionStorage.getItem("authToken");
    if (token) {
        requestConfig.headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(endpoint, requestConfig);
        if (!response.ok) {
            throw new Error(`Feil ved forespørsel: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("[ERROR apiRequest]", error);
        return null;
    }
}


export async function loginUser(email, password) {
    return await apiRequest(API_ENDPOINTS.login(), HTTP_METHODS.POST, { email, password });
}

export async function fetchProducts() {
    return await apiRequest(API_ENDPOINTS.products());
}

//Ikke implementert... Enda!
// export async function getProductById(id) {
//     return await apiRequest(API_ENDPOINTS.productById(id));
// }


export async function addProduct(productData) {
    return await apiRequest(API_ENDPOINTS.products(), HTTP_METHODS.POST, productData);
}

export async function deleteProduct(id) {
    return await apiRequest(API_ENDPOINTS.productById(id), HTTP_METHODS.DELETE);
}

export async function updateProduct(id, productData) {
    return await apiRequest(API_ENDPOINTS.productById(id), HTTP_METHODS.PATCH, productData);
}