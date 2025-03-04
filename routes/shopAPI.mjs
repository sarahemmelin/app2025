import express from "express";
import { authenticateToken } from "../modules/auth.mjs";
import { getAllProducts, getProduct, createProduct, deleteProduct } from "../controllers/shopController.mjs";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/products", getAllProducts);
router.get("/:id", getProduct);

router.post("/", authenticateToken, createProduct);
router.delete("/:id", authenticateToken, deleteProduct);

export default router;