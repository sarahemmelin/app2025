import { fetchProducts } from "./api.mjs";
import { registerServiceWorker } from "./registerSW.mjs";
import "/components/product-card.mjs";

async function initiateApp() {
    registerServiceWorker();
    const products = await fetchProducts();
    console.log("Produkter:", products);
    
    const productsContainer = document.getElementById("products");
    products.forEach(product => {
      const productCard = document.createElement("product-card");
      
      productCard.setAttribute("navn", product.navn);
      productCard.setAttribute("sku", product.sku);
      productCard.setAttribute("lager", product.lager);
      productCard.setAttribute("pris", product.pris);
      productCard.setAttribute("beskrivelse", product.beskrivelse);
      
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