import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import "../styles/login.scss"

function Login () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  })

    const data = await response.json()
    if (response.ok) {
    navigate("/")
    } else {
    setMessage(data.message)
    }
}
    return (
        <main>
            <section className="login">
                <h1>Page de connexion</h1>
                <p>Blablabla</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">email</label>
                    <input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="email@exemple.com" 
                    autoComplete="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                    id="password" 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    autoComplete="current-password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn">Se connecter</button>
                    <NavLink to="/">Retour à l'accueil</NavLink>
                </form>
                {message && <p>{message}</p>}
            </section>
        </main>
    )
}

export default Login
