import "../styles/global.css";
import React, { useState, useEffect, useRef } from 'react';

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: e.clientX - window.innerWidth / 2, 
        y: e.clientY - window.innerHeight / 2 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax calculation
  const parallaxY = scrollY * 0.3;
  const parallaxOpacity = Math.max(0, 1 - scrollY / 500);
  const parallaxScale = 1 + scrollY / 3000;

  // Custom icons
  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
    </svg>
  );

  const BullseyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );

  const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#fff',
      backgroundColor: '#000',
      overflowX: 'hidden'
    },
    heroSection: {
      position: 'relative',
      minHeight: '92vh',
      backgroundImage: `linear-gradient(135deg, rgba(0, 95, 63, 0.85) 0%, rgba(0, 30, 20, 0.95) 100%), url("https://res.cloudinary.com/dwzlaebxh/image/upload/v1742402225/event-images/nuk8ux4ougbrqsllg6id.jpg")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      transform: `translateY(${parallaxY}px) scale(${parallaxScale})`,
      opacity: parallaxOpacity,
      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
      willChange: 'transform'
    },
    particlesContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 1
    },
    particle: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(0, 168, 112, 0.3)',
      pointerEvents: 'none'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      position: 'relative',
      zIndex: 2
    },
    mainTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      background: 'linear-gradient(90deg, #ffffff, #a8ffda)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: 1.2,
      animation: 'gradientText 5s linear infinite'
    },
    subtitle: {
      fontSize: '1.25rem',
      opacity: 0.75,
      marginBottom: '2rem',
      maxWidth: '600px'
    },
    buttonsContainer: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    button: {
      padding: '1rem 2rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      userSelect: 'none'
    },
    primaryButton: {
      background: 'linear-gradient(90deg, #00A870, #008C5E)',
      color: 'white'
    },
    secondaryButton: {
      background: 'transparent',
      color: 'white',
      border: '2px solid white'
    },
    section: {
      padding: '5rem 0',
      position: 'relative'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '1rem'
    },
    sectionSubtitle: {
      fontSize: '1.25rem',
      textAlign: 'center',
      opacity: 0.75,
      maxWidth: '700px',
      margin: '0 auto 3rem'
    },
    card: {
      padding: '2rem',
      borderRadius: '1rem',
      background: 'linear-gradient(135deg, rgba(0, 80, 53, 0.2) 0%, rgba(0, 40, 26, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    cardIcon: {
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: 'rgba(0, 168, 112, 0.2)',
      marginBottom: '1.5rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      padding: '0 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    badge: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      background: 'rgba(0, 168, 112, 0.2)',
      color: '#00A870',
      fontSize: '0.875rem',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection} ref={heroRef}>
        <div style={styles.particlesContainer}>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.particle,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: `blur(${Math.random() * 2}px)`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`
              }}
            />
          ))}
        </div>
        
        <div style={styles.content}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ maxWidth: '600px' }}>
              <span style={{...styles.badge, marginBottom: '1rem', display: 'inline-block'}}>
                Discover Amazing Events
              </span>
              <h1 style={styles.mainTitle}>
                Empowering Events, Creating Lasting Connections
              </h1>
              <p style={styles.subtitle}>
                Elevate your event experience with our powerful platform that connects communities and creates unforgettable moments.
              </p>
              <div style={styles.buttonsContainer}>
                <button 
                  style={{...styles.button, ...styles.primaryButton}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Explore Events <ChevronRightIcon />
                </button>
              </div>
            </div>
            
            <div style={{
              padding: '2rem',
              borderRadius: '1rem',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              transition: 'transform 0.1s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#00A870',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <CalendarIcon />
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: '1.125rem' }}>Upcoming Featured Event</h5>
                  <p style={{ margin: 0, color: '#00A870' }}>Next Week</p>
                </div>
              </div>
              <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Upcoming Events 2025</h4>
              <p style={{ opacity: 0.75, marginBottom: '1.5rem' }}>
                Join industry leaders for a three-day immersive experience covering AI, blockchain, and sustainable tech.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.badge}>650+ Attending</span>
                <button style={{ background: 'none', border: 'none', color: '#00A870', cursor: 'pointer' }}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{...styles.section, backgroundColor: '#0a1914'}}>
        <div style={styles.content}>
          <span style={{...styles.badge, display: 'block', textAlign: 'center', marginBottom: '1rem'}}>
            ABOUT US
          </span>
          <h2 style={styles.sectionTitle}>Transforming Event Experiences</h2>
          <p style={styles.sectionSubtitle}>
            We're revolutionizing how events are created, discovered, and experienced—connecting people, ideas, 
            and moments that matter through our innovative platform.
          </p>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section style={{...styles.section, background: 'linear-gradient(180deg, rgb(20, 56, 44) 0%, #072E1F 100%)'}}>
        <div style={styles.grid}>
          <div 
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.cardIcon}>
              <RocketIcon />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Our Vision</h3>
            <p style={{ opacity: 0.75 }}>
              To become the leading digital platform for event discovery and management across the
              globe—making every event a success story and creating meaningful connections between people.
            </p>
          </div>
          
          <div 
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={styles.cardIcon}>
              <BullseyeIcon />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Our Mission</h3>
            <p style={{ opacity: 0.75 }}>
              To empower event creators and participants with technology that makes planning,
              booking, and enjoying events simple, seamless, and meaningful while fostering community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section style={{...styles.section, backgroundColor: '#0a1914'}}>
        <div style={styles.content}>
          <span style={{...styles.badge, display: 'block', textAlign: 'center', marginBottom: '1rem'}}>
            SUCCESS STORIES
          </span>
          <h2 style={styles.sectionTitle}>Events That Made an Impact</h2>
          <p style={styles.sectionSubtitle}>
            Discover how our platform has helped event organizers create meaningful experiences and build stronger communities.
          </p>
          
          <div style={styles.grid}>
            {[
              {
                title: "Tech Summit 2024",
                description: "Connected over 5,000 tech enthusiasts across 3 days with seamless registration, digital check-ins, and interactive sessions.",
                attendees: "5,000+"
              },
              {
                title: "Cultural Fest Gala",
                description: "Managed 20+ events across multiple venues with real-time updates, QR ticketing, and personalized attendee journeys.",
                attendees: "12,000+"
              },
              {
                title: "Startup Weekend",
                description: "Facilitated 100+ pitches, mentor connections, and networking opportunities for emerging entrepreneurs and investors.",
                attendees: "1,200+"
              }
            ].map((story, index) => (
              <div 
                key={index}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.cardIcon}>
                  <LightbulbIcon />
                </div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{story.title}</h4>
                <p style={{ opacity: 0.75, marginBottom: '1.5rem' }}>{story.description}</p>
                <span style={styles.badge}>{story.attendees} Attendees</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{...styles.section, background: 'linear-gradient(135deg, #072E1F 0%, #0a1914 100%)'}}>
        <div style={{...styles.content, textAlign: 'center'}}>
          <h2 style={{...styles.sectionTitle, marginBottom: '1.5rem'}}>
            Ready to Create Unforgettable Experiences?
          </h2>
          <p style={{...styles.sectionSubtitle, marginBottom: '2.5rem'}}>
            Join thousands of event organizers who are transforming how people connect and celebrate.
          </p>
          <button 
            style={{...styles.button, ...styles.primaryButton, margin: '0 auto'}}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Started Today
          </button>
        </div>
      </section>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          
          @keyframes gradientText {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;