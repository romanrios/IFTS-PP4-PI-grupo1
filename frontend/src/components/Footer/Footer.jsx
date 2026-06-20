import githubIcon from "../../assets/github-white.svg";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <p>©2026 MichiGestión</p>
            <p>Desarrollado por <strong>Cinco Estrellas</strong> Soluciones de Software</p>
            <p>
                <a 
                    href="https://github.com/romanrios/IFTS-PP4-PI-grupo1/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-link"
                >
                    <img 
                        src={githubIcon} 
                        alt="GitHub" 
                        className="footer-icon" 
                    />
                    Visitá nuestro repositorio en GitHub
                </a>
            </p>
        </footer>
    );
}

export default Footer;