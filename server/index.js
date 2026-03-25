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

app.post("/steps", async (req, res) => {
  const { presentationId, type, content, position } = req.body;

  if (!presentationId || !type || !content || position === undefined) {
    return res.status(400).json({
      message: "presentationId, type, content et position sont requis",
    });
  }

  try {
    const result = await db.run(
      "INSERT INTO steps (presentationId, type, content, position) VALUES (?, ?, ?, ?)",
      [presentationId, type, JSON.stringify(content), position]
    );

    return res.status(201).json({
      message: "Étape créée avec succès",
      step: {
        id: result.lastID,
        presentationId,
        type,
        content,
        position,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la création de l'étape",
    });
  }
});

app.get("/steps", async (req, res) => {
  const { presentationId } = req.query;

  if (!presentationId) {
    return res.status(400).json({
      message: "presentationId est requis",
    });
  }

  try {
    const steps = await db.all(
      "SELECT * FROM steps WHERE presentationId = ? ORDER BY position ASC",
      [presentationId]
    );

    const formattedSteps = steps.map((step) => ({
      ...step,
      content: JSON.parse(step.content),
    }));

    return res.status(200).json({
      steps: formattedSteps,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des étapes",
    });
  }
});

app.get("/presentations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const presentation = await db.get(
      "SELECT * FROM presentations WHERE id = ?",
      [id]
    );

    if (!presentation) {
      return res.status(404).json({
        message: "Présentation introuvable",
      });
    }

    return res.status(200).json({ presentation });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de la présentation",
    });
  }
});

app.delete("/steps/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const existingStep = await db.get(
      "SELECT * FROM steps WHERE id = ?",
      [id]
    );

    if (!existingStep) {
      return res.status(404).json({
        message: "Étape introuvable",
      });
    }

    await db.run("DELETE FROM steps WHERE id = ?", [id]);

    return res.status(200).json({
      message: "Étape supprimée avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'étape",
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
