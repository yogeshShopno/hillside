import { Link } from 'react-router-dom';
import { MapPin, Phone, Globe, Heart } from 'lucide-react';
import styles from './Footer.module.css';

const LOGO_URL = 'https://hillsidemedicalgroup.com/wp-content/uploads/elementor/thumbs/logo-qjcyatp8t2zdgruz5lh3bvqjn1bavuh6aw0vr1nrzw.png';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <img src={LOGO_URL} alt="Hillside Medical" className={styles.logo} />
          <p>Integrated healthcare solutions for the San Antonio community.</p>
          <div className={styles.social}>
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.links}>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/providers">Providers</Link>
          <Link to="/community">Community</Link>
          <Link to="/health">Health Resources</Link>
        </div>

        <div className={styles.links}>
          <h4>Medical Groups</h4>
          <a href="https://hillsideprimarycare.com" target="_blank" rel="noopener noreferrer">Hillside Primary Care</a>
          <a href="https://www.womenswellnessofsa.com/" target="_blank" rel="noopener noreferrer">Women's Wellness</a>
          <a href="https://www.psychofsa.com/" target="_blank" rel="noopener noreferrer">Psych of SA</a>
          <a href="https://podiatryofsa.com/" target="_blank" rel="noopener noreferrer">Podiatry of SA</a>
        </div>

        <div className={styles.contact}>
          <h4>Contact Us</h4>
          <p>
            <MapPin size={16} />
            12881 I35, San Antonio, TX 78233
          </p>
          <p>
            <Phone size={16} />
            (210) 742-6555
          </p>
          <p>
            <Globe size={16} />
            www.hillsideprimarycare.com
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} Hillside Medical Network. All rights reserved.
        </p>
        <p className={styles.madeWith}>
          Made with <Heart size={14} className={styles.heart} /> for better healthcare
        </p>
      </div>
    </footer>
  );
}

