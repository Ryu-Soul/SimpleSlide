import { NavLink } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"

function Header() {
    const { user, logout } = useAuth()
    console.log(user)

   return (
        <header className="header">
            <div className="container header__inner">
                <div className="brand">SimpleSlide</div>
                <nav>
                    <NavLink to="/">Home</NavLink>
                    {user ? 
                    (<button onClick={logout}>Déconnexion</button>) 
                    : 
                    (<NavLink to="/login">Connexion</NavLink>)
                    }
                </nav>
            </div>
        </header>
    )
}

export default Header