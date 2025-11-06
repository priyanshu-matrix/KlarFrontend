import "../Style/LandingPage.css";
import TextType from "../Assets/TextType.jsx";
import Navbar from "../Components/Navbar.jsx";
import Highlight  from "../Assets/Highlight.jsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../Components/ui/button";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  useGSAP(
    () => {

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
      </div>
    </>
  );
};

export default LandingPage;
