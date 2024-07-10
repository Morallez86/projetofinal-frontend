import React from "react";
import useUserStore from "../Stores/UserStore";

function Footer() { // Rodapé
  const languageApp = useUserStore((state) => state.language); // Língua da aplicação
  
 
  const footerImage = languageApp === 'pt'  // Imagem do rodapé
    ? require("../Assets/FooterPT.jpeg")  // Português
    : require("../Assets/FooterEN.jpeg")  // Inglês
  
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