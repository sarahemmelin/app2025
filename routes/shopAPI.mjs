import express from "express";
import { getAllProducts, getProduct, createProduct, deleteProduct } from "../controllers/shopController.mjs";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

export default router;