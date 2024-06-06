import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistrationConfirmation from "../Components/RegistrationConfirmation";
import useApiStore from "../Stores/ApiStore";
import useConfirmRegistration from "../Hooks/useConfirmRegistration";

function RegistrationStatusPage() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const navigate = useNavigate();
  const { emailToken } = useParams();
  const success = useConfirmRegistration(emailToken, apiUrl);

  const handleConfirm = () => {
    navigate("/");
  };

  return (
    success !== null && (
      <RegistrationConfirmation success={success} onConfirm={handleConfirm} />
    )
  );
}

export default RegistrationStatusPage;
