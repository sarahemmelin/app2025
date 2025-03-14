import express from "express";
import pool from "../config/dbConnect.mjs";
import { authenticateToken } from "../middleware/auth.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";

const router = express.Router();

router.get("/blacklist", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM blacklist;");
        res.json(result.rows);
    } catch (error) {
        console.error("[ERROR securityAPI] Feil ved henting av blacklist:", error);
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Feil ved henting av blacklist", error });
    }
});

router.post("/blacklist", authenticateToken, async (req, res) => {
    try {
        const { ip, reason } = req.body;
        if (!ip) {
            return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: "IP-adresse må spesifiseres" });
        }

        await pool.query("INSERT INTO blacklist (ip, reason) VALUES ($1, $2) ON CONFLICT (ip) DO NOTHING;", [ip, reason || "Manuell blokkering"]);

        res.status(HTTP_CODES.SUCCESS.CREATED).json({ message: `IP ${ip} lagt til i blacklist` });
    } catch (error) {
        console.error("[ERROR securityAPI] Feil ved lagring av IP i blacklist:", error);
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Feil ved lagring av IP i blacklist", error });
    }
});

router.delete("/blacklist/:ip", authenticateToken, async (req, res) => {
    try {
        const { ip } = req.params;

        const result = await pool.query("DELETE FROM blacklist WHERE ip = $1 RETURNING *;", [ip]);

        if (result.rowCount === 0) {
            return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: `IP ${ip} ikke funnet i blacklist` });
        }

        res.json({ message: `IP ${ip} fjernet fra blacklist` });
    } catch (error) {
        console.error("[ERROR securityAPI] Feil ved sletting av IP fra blacklist:", error);
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ message: "Feil ved sletting av IP fra blacklist", error });
    }
});

export default router;
