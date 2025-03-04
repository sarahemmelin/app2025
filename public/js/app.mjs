import { registerServiceWorker } from "./registerSW.mjs";
import { initProductView } from "./productController.mjs";
import { initLoginView } from "./loginController.mjs";
import "/components/product-card.mjs";
import "/components/add-product-form.mjs";
import "/components/login-component.mjs";

async function initiateApp() {
    registerServiceWorker();
    await initProductView();
    initLoginView();
}

initiateApp();