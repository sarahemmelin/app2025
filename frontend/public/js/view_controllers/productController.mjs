import {
  fetchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../api/api.mjs";

export async function initProductView() {
  try {
    const products = await fetchProducts();
    renderProducts(products);
  } catch (error) {
    console.error("[ERROR productController] Feil ved henting av produkter:", error);
  }
}

function renderProducts(products) {
  const adminView = document.querySelector("admin-view");
  if (!adminView) return console.error("[ERROR productController] Fant ikke <admin-view> i DOM.");

  const mainContent = adminView.shadowRoot?.getElementById("mainContent");
  if (!mainContent)
    return console.error("[ERROR] Fant ikke mainContent i admin-view.");

  mainContent.innerHTML = `<div id="productContainer"></div>`;
  const productContainer = mainContent.querySelector("#productContainer");

  if (!products.length) {
    productContainer.innerHTML = "<p>Ingen produkter tilgjengelig.</p>";
  } else {
    products.forEach((product) => {
      if (!product.id || !product.produktnavn) {
        return;
      }

      const productCard = document.createElement("product-card");
      Object.entries({
        id: product.id,
        produktnavn: product.produktnavn,
        sku: product.sku,
        lager: product.lager,
        pris: product.pris,
        beskrivelse: product.beskrivelse,
      }).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          productCard.setAttribute(key, value);
        }
      });
      productContainer.appendChild(productCard);
    });
  }

  setupDeleteProductListener(productContainer);
  setupUpdateProductListener(productContainer);

  const addFormElement = document.createElement("add-product-form");
  mainContent.appendChild(addFormElement);
  setupAddProductListener(addFormElement);
}

function setupDeleteProductListener(container) {
  container.addEventListener("deleteProduct", async (event) => {
    const productId = event.detail.productId;
    try {
      const response = await deleteProduct(productId);
      if (response) {
        initProductView();
      }
    } catch (error) {
      console.error("[ERROR productController] Feil ved sletting av produkt:", error);
    }
  });
}

function setupUpdateProductListener(container) {
  container.addEventListener("updateProduct", async (event) => {
    const updatedData = event.detail;
    try {
      const response = await updateProduct(updatedData.id, updatedData);
      if (response) {
        initProductView();
      }
    } catch (error) {
      console.error("[ERROR productController] Feil ved oppdatering av produkt:", error);
    }
  });
}

function setupAddProductListener(addFormElement) {
  addFormElement.addEventListener("addProduct", async (event) => {
    const productData = event.detail;

    if (!productData.produktnavn || !productData.sku || !productData.pris) {
      return console.error(
        "[ERROR productController] Produktdata mangler nødvendige felter:",
        productData
      );
    }

    try {
      const response = await addProduct(productData);
      if (response) {
        initProductView();
      }
    } catch (error) {
      console.error("[ERROR productController] Feil ved lagring av produkt:", error);
    }
  });
}
