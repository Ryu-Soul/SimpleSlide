import { NavLink } from 'react-router-dom'

function Header() {
   return (
        <header className="header">
            <div className="container header__inner">
                <div className="brand">SimpleSlide</div>
                <nav>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/login">Connexion</NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header