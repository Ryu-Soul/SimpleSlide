const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

let db;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    await db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );

    return res.status(201).json({ message: "Compte créé avec succès" });
  } catch (error) {
    return res.status(409).json({ message: "Cet email existe déjà" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const user = await db.get(
    "SELECT id, email FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  return res.status(200).json({
    message: "Connexion réussie",
    user,
  });
});

async function startServer() {
  db = await initDb();

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

startServer();
