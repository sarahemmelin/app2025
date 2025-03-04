import express from "express";
import { storeToken } from "../modules/auth.mjs";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const users = [
  {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  }
];

function generateToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: "Feil brukernavn eller passord" });
  }

  const token = generateToken();
  storeToken(token);



  res.json({ message: "Innlogging vellykket", token });
});

export default router;
