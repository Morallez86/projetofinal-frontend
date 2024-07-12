import React, { useState } from 'react';
import { Tabs } from "flowbite-react";
import { RiLoginCircleFill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";
import { motion } from "framer-motion";
import pincel from "../Assets/pincel.png";
import { useTranslation } from "react-i18next";





function CheckoutForm() { // Formulário de checkout
  const [isTabLogActive, setIsTabLogActive] = useState(true);
  const [ isTabRegActive, setIsTabRegActive] = useState(false);

  const { t } = useTranslation(); // Traduzir o texto



  return (
    <div className="flex justify-center">
      <Tabs aria-label="Default tabs" className="mx-auto">
        <Tabs.Item active title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 }, // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          onClick={() =>  {setIsTabLogActive(true); setIsTabRegActive(false);} }// Atualiza o estado ao clicar

                          style={{
                            position: "relative",
                            display: "flex", // Usa flexbox para alinhar ícone e texto
                            alignItems: "center", // Centraliza verticalmente o ícone e o texto
                            justifyContent: "center", // Centraliza horizontalmente o ícone e o texto
                            color: "black", // Mantém a cor do texto como preto quando ativo
                            fontWeight: "bold", // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover", // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: "center", // Centraliza a imagem de fundo
                            filter: isTabLogActive ? "drop-shadow(2px 4px 6px black)" : "contrast(0.5)",

                          }}
                        >
                          <RiLoginCircleFill
                            style={{ marginRight: "8px", fontSize: "19px" }}
                          />{" "}
                           {t('Login')}&nbsp;&nbsp;
                        </motion.div>
                      } >
          <LoginCard />
        </Tabs.Item>
        <Tabs.Item title={
                        <motion.div
                          whileHover={{
                            x: [0, -2, 2, -2, 2, 0], // Move o elemento horizontalmente para criar o efeito de tremor
                            transition: { duration: 0.4 }, // Ajusta a duração da animação para que o tremor seja rápido
                          }}
                          whileTap={{ scale: 0.95, rotate: -10, color: "#F00" }}
                          onClick={() =>  { setIsTabRegActive(true);
                            setIsTabLogActive(false);} }

                          style={{
                            position: "relative",
                            display: "flex", // Usa flexbox para alinhar ícone e texto
                            alignItems: "center", // Centraliza verticalmente o ícone e o texto
                            justifyContent: "center", // Centraliza horizontalmente o ícone e o texto
                            color: "black", // Mantém a cor do texto como preto quando ativo
                            fontWeight: "bold", // Torna o texto em negrito
                            backgroundImage: `url(${pincel})`, // Define a imagem de pincel como plano de fundo
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover", // Garante que a imagem de fundo cubra todo o espaço disponível
                            backgroundPosition: "center", // Centraliza a imagem de fundo
                            filter: isTabRegActive ? "drop-shadow(2px 4px 6px black)" : "contrast(0.5)",

                          }}
                        >
                          <RxAvatar
                            style={{ marginRight: "8px", fontSize: "19px" }}
                          />{" "}
                          {t('Register')}&nbsp;&nbsp;
                        </motion.div>
                      } >
          <RegisterCard />
        </Tabs.Item>
      </Tabs>
    </div>
  );
}

export default CheckoutForm;
