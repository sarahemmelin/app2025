import { registerServiceWorker } from "./registerSW.mjs";
import { initProductView } from "./productController.mjs";
import "/components/product-card.mjs";
import "/components/add-product-form.mjs";

async function initiateApp() {
    registerServiceWorker();
    await initProductView();
}

initiateApp();