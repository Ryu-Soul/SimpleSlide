const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())
app.get("/health", (req, res) => {
  res.json({ ok: true })
})
app.listen(5000, () => {
  console.log("Server running")
})
app.post("/login", (req, res) => {
    const { email, password } = req.body
    const fakeUser = {
    email: "test@test.com",
    password: "1234"
    }
        if (!email || !password) {
    return res.status(400).json({
        message: "Email et mot de passe requis"
    })
    }
        if (email !== fakeUser.email || password !== fakeUser.password) {
    return res.status(401).json({
        message: "Identifiants invalides"
    })
    }
    return res.json({
    message: "Connexion réussie"
    })
})
