// Components/Contact.jsx
import { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // You can implement your email API endpoint here
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="page-hero-thin">
        <div className="page-container">
          <span className="section-label fade-up">Get in Touch</span>
          <h1 className="page-hero-thin__title fade-up delay-1">
            We'd Love to<br /><em>Hear From You</em>
          </h1>
          <p className="page-hero-thin__desc fade-up delay-2">
            Whether you have a question about our collection, want to inquire about a work,
            or simply wish to learn more about Aboriginal art — we're here to help.
          </p>
        </div>
      </div>

      <div className="page-container">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-info__item">
              <span className="contact-info__label">Visit</span>
              <p className="contact-info__value">
                14 Argyle St, The Rocks<br />
                Sydney NSW 2000<br />
                Australia
              </p>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Hours</span>
              <p className="contact-info__value">
                Tuesday – Sunday: 10:00 – 17:00<br />
                Monday: Closed
              </p>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Contact</span>
              <p className="contact-info__value">
                +61 2 9241 5555<br />
                info@ngurinigallery.com.au
              </p>
            </div>
            <div className="contact-info__item">
              <span className="contact-info__label">Follow</span>
              <div className="contact-socials">
                <a href="#" className="contact-social">Instagram</a>
                <a href="#" className="contact-social">Facebook</a>
                <a href="#" className="contact-social">LinkedIn</a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <div className="contact-form__group">
                <label className="contact-form__label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="contact-form__input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="contact-form__input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="contact-form__group">
              <label className="contact-form__label">Subject</label>
              <input
                type="text"
                name="subject"
                className="contact-form__input"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-form__group">
              <label className="contact-form__label">Message</label>
              <textarea
                name="message"
                className="contact-form__textarea"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="contact-form__submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {error && <div className="contact-form__error">{error}</div>}
            {submitted && (
              <div className="contact-form__success">
                Thank you for your message. We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="contact-map">
        <iframe
          title="Gallery Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.345678901234!2d151.2089!3d-33.8591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae4e4b4b4b4b%3A0x1234567890abcdef!2sThe%20Rocks%2C%20Sydney!5e0!3m2!1sen!2sau!4v1234567890123!5m2!1sen!2sau"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </main>
  );
}