import React from "react";
import { Card } from "flowbite-react";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

function WarningsRegisterCard() {
  return (
    <Card className="max-w-sm overflow-auto">
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span> Email format is incorrect!
      </Alert>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span>
        Password isn't strong enough
      </Alert>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span>
        Passwords don't match
      </Alert>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span>
        You can only enter 2 names (first and last)
      </Alert>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span>
        The required fields are not all filled in
      </Alert>
    </Card>
  );
}

export default WarningsRegisterCard;
