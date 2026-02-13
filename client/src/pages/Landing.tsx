import { NavLink } from "react-router-dom"

function Landing () {
    return (
        <main>
            <section className="hero">
                <h1>Créer et réaliser une presentation facilement !</h1>
                <p>Blablabla</p>
                <NavLink to="/login" className="btn">Se connecter</NavLink>
            </section>
            <section className="features">
                <div className="feature">
                    <h2>Personnalisez votre presentation</h2>
                    <p>Blablabla</p>
                    <NavLink to="/login" className="btn">Je me lance !</NavLink>
                </div>
                <div className="feature">
                    <h2>Comment créer votre présentation ?</h2>
                    <p> Blablabla</p>
                </div>
            </section>
        </main>
    )
}

export default Landing
