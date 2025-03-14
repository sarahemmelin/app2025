import express from "express";
import { storeToken, verifyPassword } from "../modules/auth.mjs";
import { DEBUG_MODE } from "../config/debug.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";

const router = express.Router();

if (DEBUG_MODE){
console.log("[DEBUG authAPI] Render Environment Variables:");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN_SALT:", process.env.ADMIN_SALT);
console.log("ADMIN_HASH:", process.env.ADMIN_HASH);
}


function generateToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

router.post("/login", (req, res) => {
  if (DEBUG_MODE) console.log("[DEBUG authAPI] Mottatt req.body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message: "E-post og passord kreves." });
  } 

  const admin = {
    email: process.env.ADMIN_EMAIL,
    salt: process.env.ADMIN_SALT,
    passwordHash: process.env.ADMIN_HASH
  };

  if (email !== admin.email) {
    console.error("[ERROR authAPI] Feil e-post!");
    return res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).json({ message: "Feil brukernavn eller passord." });
  }

  if (!verifyPassword(password, admin.salt, admin.passwordHash)) {
    console.error("[ERROR authAPI] Feil passord!");
    return res.status(HTTP_CODES.CLIENT_ERROR.UNAUTHORIZED).json({ message: "Feil brukernavn eller passord." });
  }

  const token = generateToken();
  if (DEBUG_MODE) console.log("[DEBUG authAPI] Innlogging vellykket. Token:", token);
  storeToken(token);

  res.json({ message: "Innlogging vellykket", token });
});

export default router;
