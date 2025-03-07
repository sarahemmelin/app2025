import { registerServiceWorker } from "./registerSW.mjs";
import { handleRouting } from "./router/router.mjs";
import { checkLoginStatus } from "./controllers/loginController.mjs";
import "/components/product-card.mjs";
import "/components/add-product-form.mjs";
import "/components/login-component.mjs";

async function initiateApp() {
    registerServiceWorker();
    checkLoginStatus();
    handleRouting();
}

initiateApp();