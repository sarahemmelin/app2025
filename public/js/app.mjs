import { fetchProducts } from "./api.mjs";
import { registerServiceWorker } from "./registerSW.mjs";
import "/components/product-card.mjs";

async function initiateApp() {
    registerServiceWorker();
    const products = await fetchProducts();

    const productsContainer = document.getElementById("products");

    const filteredProducts = products.filter(product => product.id !== "0");
    filteredProducts.forEach(product => {
      const productCard = document.createElement("product-card");

      if (!product.navn) {
        console.warn ("produktet mangler navn, setter til 'Ukjent produkt'");
        product.navn = "Ukjent produkt";
      }
      
      productCard.setAttribute("id", product.id);
      productCard.setAttribute("navn", product.navn);
      productCard.setAttribute("sku", product.sku || "Ukjent SKU");
      productCard.setAttribute("lager", product.lager || "0");
      productCard.setAttribute("pris", product.pris || "0");
      productCard.setAttribute("beskrivelse", product.beskrivelse || "Ingen beskrivelse");
      
      if (product.farge) {
        productCard.setAttribute("farge", product.farge);
      }
      if (product.pigmenter) {
        productCard.setAttribute("pigmenter", Array.isArray(product.pigmenter) ? product.pigmenter.join(", ") : product.pigmenter);
      }
      
      productsContainer.appendChild(productCard);
    });
  }
  
  initiateApp();