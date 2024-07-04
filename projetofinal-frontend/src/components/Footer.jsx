import React from "react";
import useUserStore from "../Stores/UserStore";

function Footer() {
  const languageApp = useUserStore((state) => state.language);
  
 
  const footerImage = languageApp === 'pt' 
    ? require("../Assets/FooterPT.jpeg") 
    : require("../Assets/FooterEN.jpeg") 
  
  return (
    <div className="w-full text-center relative bottom-0 z-50 mt-2 p-0">
      <img
        src={footerImage}
        alt="Footer"
        className="w-full object-cover"
      />
    </div>
  );
}

export default Footer;