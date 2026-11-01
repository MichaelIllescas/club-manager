import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Club Manager</span>
      <span>
        Desarrollado por{" "}
        <a href="https://github.com/MichaelIllescas" target="_blank" rel="noopener noreferrer">
          Jonathan Illescas
        </a>
      </span>
    </footer>
  );
};

export default Footer;
