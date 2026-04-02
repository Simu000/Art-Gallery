import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <div className="footer__logo">Ngurini</div>
          <p className="footer__tagline">
            Dedicated to the world's oldest living artistic tradition.
            Located on the lands of the Gadigal people of the Eora Nation.
          </p>
          <p className="footer__acknowledgement">
            We acknowledge Aboriginal and Torres Strait Islander peoples as the
            First Peoples of Australia and recognise their continuing connection
            to land, culture, and community.
          </p>
        </div>

        <div className="footer__col">
          <div className="footer__col-title">Explore</div>
          <Link to="/artists" className="footer__link">Artists</Link>
          <Link to="/artifacts" className="footer__link">Collection</Link>
          <Link to="/exhibitions" className="footer__link">Exhibitions</Link>
          <Link to="/community" className="footer__link">Community</Link>
        </div>

        <div className="footer__col">
          <div className="footer__col-title">Visit</div>
          <span className="footer__text">14 Argyle St, The Rocks</span>
          <span className="footer__text">Sydney NSW 2000</span>
          <span className="footer__text">Tue – Sun: 10:00 – 17:00</span>
          <span className="footer__text">+61 2 9241 5555</span>
        </div>

        <div className="footer__col">
          <div className="footer__col-title">Connect</div>
          <a href="#" className="footer__link">Instagram</a>
          <a href="#" className="footer__link">Facebook</a>
          <a href="#" className="footer__link">Newsletter</a>
          <a href="#" className="footer__link">Press</a>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2025 Ngurini Gallery. All rights reserved.</span>
        <span>Built with respect for Country.</span>
      </div>
    </footer>
  )
}