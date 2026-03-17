import { NavLink } from "react-router-dom"
import "../styles/login.scss"

function Login () {
    return (
        <main>
            <section className="login">
                <h1>Page de connexion</h1>
                <p>Blablabla</p>
                <form>
                    <label htmlFor="email">email</label>
                    <input id="email" type="email" required placeholder="email@exemple.com" autoComplete="email"/>
                    <label htmlFor="password">Mot de passe</label>
                    <input id="password" type="password" required placeholder="••••••••" autoComplete="current-password"/>
                    <button type="submit" className="btn">Se connecter</button>
                    <NavLink to="/">Retour à l'accueil</NavLink>
                </form>
            </section>
        </main>
    )
}

export default Login
