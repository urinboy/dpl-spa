import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🏪 DOM Product</h3>
            <p>Энг яхши маҳсулотлар платформаси</p>
          </div>

          <div className="footer-section">
            <h4>Саҳифалар</h4>
            <ul>
              <li><a href="/">Бош саҳифа</a></li>
              <li><a href="/products">Маҳсулотлар</a></li>
              <li><a href="/about">Биз ҳақимизда</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Алоқа</h4>
            <ul>
              <li>📧 info@domproduct.uz</li>
              <li>📞 +998 90 123 45 67</li>
              <li>📍 Тошкент, Ўзбекистон</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 DOM Product. Барча ҳуқуқлар ҳимояланган.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
