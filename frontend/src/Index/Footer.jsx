import "/src/Index/Footer.css"

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 text-center sticky-footer col-lg-12 col-sm-12">
      <div className="container">
        <p className="mb-1">© {new Date().getFullYear()} Club Manager - Sistema de gestión de clubes</p>
        <p className="mb-0 small">
          Desarrollado por{" "}
          <a
            href="https://github.com/MichaelIllescas"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            Jonathan Illescas
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
