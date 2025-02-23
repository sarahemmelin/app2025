import express from "express";
import { authenticateAPIKey } from "../modules/auth.mjs";
import { getAllProducts, getProduct, createProduct, deleteProduct } from "../controllers/shopController.mjs";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", authenticateAPIKey, createProduct);
router.delete("/:id", authenticateAPIKey, deleteProduct);

export default router;