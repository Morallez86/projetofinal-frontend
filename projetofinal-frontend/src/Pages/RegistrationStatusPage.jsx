import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistrationConfirmation from "../Components/RegistrationConfirmation";
import useApiStore from "../Stores/ApiStore";
import useConfirmRegistration from "../Hooks/useConfirmRegistration";

function RegistrationStatusPage() {
  const apiUrl = useApiStore((state) => state.apiUrl); // apiUrl
  const navigate = useNavigate(); 
  const { emailToken } = useParams(); // token do email
  const success = useConfirmRegistration(emailToken, apiUrl); // sucesso

  const handleConfirm = () => { // função para confirmar
    navigate("/"); // navegar para a página inicial
  };

  return (
    success !== null && (
      <RegistrationConfirmation success={success} onConfirm={handleConfirm} />
    )
  );
}

export default RegistrationStatusPage;
