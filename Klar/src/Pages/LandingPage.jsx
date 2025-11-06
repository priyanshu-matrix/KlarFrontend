import "../Style/LandingPage.css";
import TextType from "../Assets/TextType.jsx";
import Navbar from "../Components/Navbar.jsx";

const LandingPage = () => {
  return (
    <>
      <div className="pg">
        <Navbar
          bullets={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Contact", path: "/contact" }
          ]}
        />
        <div className="CentreText">
          {/* Background Prism */}
          <div className="prism-background">

          </div>

          {/* Foreground Text Content */}
          <div className="text-content">
            KLAR, Your personal{" "}
            <TextType
              text={[" Invoice Manager", " Finance Manager"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              autoGenerateColors={true}
            />
          </div>
          {/* Basic message*/}

          <div className="subtext-content">
            Simplify your invoicing and financial management with KLAR.
          </div>

        </div>
      </div>
    </>
  );
};

export default LandingPage;
