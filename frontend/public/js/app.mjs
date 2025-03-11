import { registerServiceWorker } from "./registerSW.mjs";
import { handleRouting } from "./router/router.mjs";
import { checkLoginStatus } from "./view_controllers/loginController.mjs";
import "/components/product-card.mjs";
import "/components/add-product-form.mjs";
import "/components/login-component.mjs";
import "/components/admin-view.mjs";

async function initiateApp() {
    registerServiceWorker();
    checkLoginStatus();
    handleRouting();
}

initiateApp();