import { motion } from "framer-motion";

// SVG icons as components
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="#141b2d" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#141b2d" strokeWidth="2" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.9
    }
  };

  const waveVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <footer className="modern-footer">
      {/* Wave decoration with animation */}
      <motion.div 
        className="footer-wave"
        variants={waveVariants}
        initial="initial"
        animate="animate"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            fill="#141b2d" 
            d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
          ></path>
        </svg>
      </motion.div>

      {/* Main footer content */}
      <div className="footer-content">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="row">
              {/* Company info */}
              <div className="col-md-4 footer-column">
                <motion.div variants={columnVariants}>
                  <motion.h4 
                    className="footer-title"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    EventEase<span className="title-dot">.</span>
                  </motion.h4>
                  <p className="footer-description">
                    Creating unforgettable experiences and bringing people together through expertly managed events.
                  </p>
                  <div className="social-icons">
                    {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                      <motion.a 
                        href="#" 
                        key={index}
                        className="social-icon"
                        variants={socialIconVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Icon />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Quick links */}
              <div className="col-md-2 footer-column">
                <motion.div variants={columnVariants}>
                  <h5 className="footer-subtitle">Quick Links</h5>
                  <ul className="footer-links">
                    {[
                      { href: "/events", text: "Events" },
                      { href: "/register", text: "Register" },
                      { href: "/login", text: "Login" },
                      { href: "/gallery", text: "Gallery" }
                    ].map((link, index) => (
                      <motion.li 
                        key={index}
                        whileHover={{ x: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <a href={link.href}>{link.text}</a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Services */}
              <div className="col-md-3 footer-column">
                <motion.div variants={columnVariants}>
                  <h5 className="footer-subtitle">Our Services</h5>
                  <ul className="footer-links">
                    {[
                      { href: "/services/corporate", text: "Corporate Events" },
                      { href: "/services/weddings", text: "Weddings" },
                      { href: "/services/concerts", text: "Concerts" },
                      { href: "/services/conferences", text: "Conferences" }
                    ].map((service, index) => (
                      <motion.li 
                        key={index}
                        whileHover={{ x: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <a href={service.href}>{service.text}</a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Contact */}
              <div className="col-md-3 footer-column">
                <motion.div variants={columnVariants}>
                  <h5 className="footer-subtitle">Contact Us</h5>
                  <address className="footer-contact">
                    {[
                      { icon: "📍", text: "Calicut, Kerala" },
                      { icon: "📞", text: "+974 50256375" },
                      { icon: "✉️", text: "info@eventease.com" }
                    ].map((contact, index) => (
                      <motion.p 
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <i className="contact-icon">{contact.icon}</i> {contact.text}
                      </motion.p>
                    ))}
                  </address>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-md-start">
              <motion.p 
                className="copyright"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                &copy; {currentYear} EventEase. All Rights Reserved.
              </motion.p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-legal">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <a href="/privacy">Privacy Policy</a>
                  <a href="/terms">Terms of Service</a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for the component */}
      <style jsx>{`
        .modern-footer {
          position: relative;
          background-color: #141b2d;
          color: #fff;
          padding-top: 100px;
          overflow: hidden;
        }

        .footer-wave {
          position: absolute;
          top: -1px;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }

        .footer-wave svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 100px;
        }

        .footer-content {
          padding: 60px 0;
          position: relative;
          z-index: 1;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -15px;
        }

        .col-md-6 {
          width: 100%;
          padding: 0 15px;
        }

        .col-md-4 {
          width: 100%;
          padding: 0 15px;
        }

        .col-md-3 {
          width: 100%;
          padding: 0 15px;
        }

        .col-md-2 {
          width: 100%;
          padding: 0 15px;
        }

        @media (min-width: 768px) {
          .col-md-6 {
            width: 50%;
          }
          .col-md-4 {
            width: 33.333333%;
          }
          .col-md-3 {
            width: 25%;
          }
          .col-md-2 {
            width: 16.666667%;
          }
          .text-md-start {
            text-align: left !important;
          }
          .text-md-end {
            text-align: right !important;
          }
        }

        .footer-column {
          margin-bottom: 30px;
        }

        .footer-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #fff;
        }

        .title-dot {
          color: #60a5fa;
          display: inline-block;
        }

        .footer-subtitle {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #60a5fa;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-subtitle::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, #60a5fa, transparent);
          border-radius: 2px;
        }

        .footer-description {
          font-size: 1rem;
          color: #94a3b8;
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .social-icons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(96, 165, 250, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #60a5fa;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(96, 165, 250, 0.2);
        }

        .social-icon:hover {
          background: #60a5fa;
          color: #fff;
          border-color: #60a5fa;
          box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1rem;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #60a5fa;
        }

        .footer-contact {
          font-style: normal;
        }

        .footer-contact p {
          margin-bottom: 15px;
          color: #94a3b8;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .contact-icon {
          font-style: normal;
          font-size: 1.2rem;
        }

        .footer-bottom {
          background: rgba(0, 0, 0, 0.3);
          padding: 20px 0;
          position: relative;
          z-index: 1;
        }

        .copyright {
          margin: 0;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .footer-legal a {
          color: #94a3b8;
          text-decoration: none;
          margin-left: 20px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .footer-legal a:hover {
          color: #60a5fa;
        }

        .align-items-center {
          align-items: center;
        }

        @media (max-width: 767px) {
          .footer-column {
            text-align: center;
          }

          .footer-subtitle::after {
            left: 50%;
            transform: translateX(-50%);
          }

          .social-icons {
            justify-content: center;
          }

          .footer-contact p {
            justify-content: center;
          }

          .footer-legal a {
            margin: 0 10px;
          }

          .text-md-start,
          .text-md-end {
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;