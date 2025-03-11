import express from "express";
import { storeToken, verifyPassword } from "../modules/auth.mjs";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

function generateToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

router.post("/login", (req, res) => {
  console.log("[DEBUG] Mottatt req.body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "E-post og passord kreves." });
  } 

  const admin = {
    email: process.env.ADMIN_EMAIL,
    salt: process.env.ADMIN_SALT,
    passwordHash: process.env.ADMIN_HASH
  };
  
  console.log("[DEBUG] Forventet admin-email:", admin.email);
  console.log("[DEBUG] Bruker oppgitt email:", email);

  if (email !== admin.email) {
    console.error("[ERROR authAPI] Feil e-post!");
    return res.status(401).json({ message: "Feil brukernavn eller passord." });
  }

  console.log("[DEBUG] Verifiserer passord...");

  if (!verifyPassword(password, admin.salt, admin.passwordHash)) {
    console.error("[ERROR authAPI] Feil passord!");
    return res.status(401).json({ message: "Feil brukernavn eller passord." });
  }

  console.log("[DEBUG] Passord OK. Genererer token...");

  const token = generateToken();
  console.log("[DEBUG] Innlogging vellykket. Token:", token);
  storeToken(token);

  res.json({ message: "Innlogging vellykket", token });
});

export default router;
