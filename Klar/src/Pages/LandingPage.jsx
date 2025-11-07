import "../Style/LandingPage.css";
import TextType from "../Assets/TextType.jsx";
import Navbar from "../Components/Navbar.jsx";
import Highlight  from "../Assets/Highlight.jsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import { Button } from "../Components/ui/button";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  useGSAP(
    () => {
      // Animate features header on scroll
      gsap.fromTo(".features-title",
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".features-subtitle",
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate feature cards with stagger
      gsap.fromTo(".feature-card",
        {
          opacity: 0,
          y: 60,
          rotationY: 15,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate statistics with counter effect
      gsap.fromTo(".stat-item",
        {
          opacity: 0,
          y: 40,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".features-stats",
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate CTA section
      gsap.fromTo(".cta-title",
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-final-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".cta-description",
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".cta-final-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(".cta-buttons",
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".cta-final-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Counter animations for both sections
      document.querySelectorAll('.stat-number, .cta-stat-number').forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = counter.getAttribute('data-target').includes('.');

        gsap.fromTo(counter,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2.5,
            ease: "power2.out",
            snap: { textContent: isDecimal ? 0.1 : 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // Animate CTA stats
      gsap.fromTo(".cta-stat",
        {
          opacity: 0,
          y: 40,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".cta-stats-grid",
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Hover animations for feature cards
      document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            rotationY: 5,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out"
          });

          gsap.to(card.querySelector('.feature-icon'), {
            scale: 1.2,
            rotation: 10,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });

          gsap.to(card.querySelector('.feature-icon'), {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }
  );
  return (
    <>
      <div className="pg">
        <Navbar
          bullets={[
            { label: "Login", path: "/login" },
            { label: "Sign Up", path: "/signup" },
          ]}
        />
        <div className="CentreText">
          {/* Background Prism */}

          {/* Foreground Text Content */}
          <div className="text-content">
            KLAR, Your personal{" "}
            <TextType
              text={[" Invoice Manager.", " Finance Manager."]}
              typingSpeed={75}
              pauseDuration={3000}
              showCursor={true}
              cursorCharacter="|"
              autoGenerateColors={true}
            />
          </div>
          {/* Basic message*/}
          <div className="subtext-content">
            Simplify your invoicing and financial management with KLAR.
          </div>
          <Button
            className="get-started-button"
            size="lg"
            variant="outline"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
        <div className="MiddleStuff">
          <div className="subtext-content">
            Take control of your business finances with KLAR's comprehensive invoice and financial management platform.
            <Highlight text="Streamline your billing" palette="success" variant="subtle" /> process, track payments effortlessly, and gain valuable insights into your cash flow.
            From creating professional invoices to monitoring expenses and generating detailed financial reports,
            KLAR empowers <Highlight text="entrepreneurs and businesses" palette="primary" variant="subtle" /> to make informed decisions while saving time and reducing errors.
            Experience the peace of mind that comes with organized finances and automated workflows,
            allowing you to focus on what matters most - growing your business.
          </div>
        </div>

        {/* Section 2 - Features Showcase */}
        <div className="features-section">
          <div className="features-container">
            <div className="features-header">
              <h2 className="features-title">Why Choose KLAR?</h2>
              <p className="features-subtitle">Built for modern businesses that demand excellence</p>
            </div>

            <div className="features-grid">
              <div className="feature-card" data-feature="processing">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-bg"></div>
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1"/>
                    <path d="M3 12v6c0 .552.448 1 1 1h16c.552 0 1-.448 1-1v-6"/>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Smart Processing</h3>
                  <p>AI-powered extraction with 99.7% accuracy. Upload invoices and watch intelligent automation handle the rest.</p>
                </div>
              </div>

              <div className="feature-card" data-feature="analytics">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-bg"></div>
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18"/>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Real-Time Insights</h3>
                  <p>Dynamic dashboards and analytics that provide instant visibility into your financial health and trends.</p>
                </div>
              </div>

              <div className="feature-card" data-feature="security">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-bg"></div>
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Enterprise Security</h3>
                  <p>Bank-grade security with intelligent verification systems ensuring data integrity and compliance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 - Final Call to Action */}
        <div className="cta-final-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Transform Your Business?</h2>
              <p className="cta-description">
                Join thousands of businesses already using KLAR to streamline their financial operations.
                Start your journey towards organized, efficient, and intelligent invoice management today.
              </p>
              <div className="cta-buttons">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="cta-primary-btn"
                >
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="cta-secondary-btn"
                >
                  Sign In
                </Button>
              </div>
              <p className="cta-note">No credit card required • 14-day free trial • Cancel anytime</p>
            </div>

            <div className="cta-stats-grid">
              <div className="cta-stat">
                <div className="cta-stat-number" data-target="10000">0</div>
                <div className="cta-stat-label">Invoices Processed</div>
              </div>
              <div className="cta-stat">
                <div className="cta-stat-number" data-target="500">0</div>
                <div className="cta-stat-label">Happy Customers</div>
              </div>
              <div className="cta-stat">
                <div className="cta-stat-number" data-target="99.7">0</div>
                <div className="cta-stat-label">% Accuracy Rate</div>
              </div>
              <div className="cta-stat">
                <div className="cta-stat-number" data-target="90">0</div>
                <div className="cta-stat-label">% Time Saved</div>
              </div>
            </div>
          </div>
        </div>


        {/* Footer */}
        <footer className="footer-section">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>KLAR</h3>
              <p>Intelligent Invoice Management</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#integrations">Integrations</a></li>
                  <li><a href="#api">API</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#contact">Contact</a></li>
                  <li><a href="#blog">Blog</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li><a href="#help">Help Center</a></li>
                  <li><a href="#docs">Documentation</a></li>
                  <li><a href="#community">Community</a></li>
                  <li><a href="#status">Status</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#privacy">Privacy Policy</a></li>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#security">Security</a></li>
                  <li><a href="#compliance">Compliance</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 KLAR. All rights reserved.</p>
              <div className="social-links">
                <a href="#twitter" aria-label="Twitter">Twitter</a>
                <a href="#linkedin" aria-label="LinkedIn">LinkedIn</a>
                <a href="#github" aria-label="GitHub">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
