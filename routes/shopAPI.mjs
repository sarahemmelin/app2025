import express from "express";
import { authenticateAPIKey } from "../modules/auth.mjs";
import { getAllProducts, getProduct, createProduct, deleteProduct } from "../controllers/shopController.mjs";
import { vanguard } from "../modules/vanguard.mjs"; 

const router = express.Router();

router.get("/", getAllProducts);
router.get("/products", getAllProducts);
router.get("/:id", getProduct);
router.post("/", (req, res, next) => {
    if (vanguard.skills[0].use(req, res)) next();
  }, authenticateAPIKey, createProduct);
router.delete("/:id", authenticateAPIKey, deleteProduct);

export default router;