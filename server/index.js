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

app.post("/presentations", async (req, res) => {
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({
      message: "userId et title sont requis",
    });
  }

  const createdAt = new Date().toISOString();

  try {
    const result = await db.run(
      "INSERT INTO presentations (userId, title, createdAt) VALUES (?, ?, ?)",
      [userId, title, createdAt]
    );

    return res.status(201).json({
      message: "Présentation créée avec succès",
      presentation: {
        id: result.lastID,
        userId,
        title,
        createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la création de la présentation",
    });
  }
});

app.get("/presentations", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      message: "userId est requis",
    });
  }

  try {
    const presentations = await db.all(
      "SELECT * FROM presentations WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    return res.status(200).json({ presentations });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des présentations",
    });
  }
});

async function startServer() {
  db = await initDb();

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

startServer();
