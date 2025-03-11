//TODO:
// 1. productController har [ERROR productController] for Error-meldinger. [DEBUG productController] for debug-meldinger.
// 2. Sette alle console.log inn i en if - sjekk for debugMode (hvis noen).

const DEBUG_MODE = true;

import { fetchProducts } from "../api/api.mjs";

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
  if (!adminView) {
    console.error("[ERROR productController] Fant ikke <admin-view> i DOM.");
    return;
  }

  const mainContent = adminView.shadowRoot?.getElementById("mainContent");
  if (!mainContent) {
    console.error("[ERROR productController] Fant ikke mainContent i admin-view.");
    return;
  }

  if (DEBUG_MODE) console.log("[DEBUG productController] Tømmer mainContent for å vise produkter...");

  mainContent.innerHTML = "";

  const productContainer = document.createElement("div");
  productContainer.setAttribute("id", "productContainer");
  mainContent.appendChild(productContainer);

  const filteredProducts = products.filter(product => product.id !== "0");

  if (filteredProducts.length === 0) {
    productContainer.innerHTML = "<p>Ingen produkter tilgjengelig.</p>";
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product);
    productContainer.appendChild(productCard);
  });

  const addForm = document.createElement("add-product-form");
  mainContent.appendChild(addForm);
}

function createProductCard(product) {
  const productCard = document.createElement("product-card");

  productCard.setAttribute("id", product.id);
  productCard.setAttribute("navn", product.navn || "Ukjent produkt");
  productCard.setAttribute("sku", product.sku || "Ukjent SKU");
  productCard.setAttribute("lager", product.lager || "0");
  productCard.setAttribute("pris", product.pris || "0");
  productCard.setAttribute("beskrivelse", product.beskrivelse || "Ingen beskrivelse");

  if (product.farge) {
    productCard.setAttribute("farge", product.farge);
  }
  if (product.pigmenter) {
    productCard.setAttribute("pigmenter", product.pigmenter.join(", "));
  }

  return productCard;
}