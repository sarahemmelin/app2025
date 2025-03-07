import { fetchProducts } from "./api.mjs";

export async function initProductView() {
  try{
    const products = await fetchProducts();
    renderProducts(products);
  }
  catch (error) {
    console.error("[ERROR] Feil ved henting av produkter:", error);
  }
}


function renderProducts(products) {
  const productsContainer = document.getElementById("products");
  const productFormsContainer = document.getElementById("addProductForm");

    if (!productsContainer) {
      console.error("[ERROR] Fant ikke 'products'-div i DOM.");
      return;
    }

    if (!productFormsContainer) {
      console.error("[ERROR] Fant ikke 'addProductForm'-div i DOM.");
      return;
    }

    productsContainer.innerHTML = "";
    productFormsContainer.innerHTML = "";

    const filteredProducts = products.filter(product => product.id !== "0");

    filteredProducts.forEach((product) => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
    
    const addForm = document.createElement("add-product-form");
    productFormsContainer.appendChild(addForm);
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
