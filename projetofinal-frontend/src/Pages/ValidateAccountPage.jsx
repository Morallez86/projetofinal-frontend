import React from "react";
import ValidateAccountCard from "../Components/ValidateAccountCard";
import { Badge } from "flowbite-react";

function ValidateAccountPage() {
  return (
    
    <div className="flex justify-center items-center h-screen flex-col">
        <Badge color="info" className="mb-4" style={{ fontSize: '15px', fontWeight: 'bold'}} > Fill in the following information to validate your account </Badge>
      <ValidateAccountCard />
    </div>
  );
}

export default ValidateAccountPage;
