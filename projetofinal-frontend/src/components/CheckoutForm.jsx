import React from "react";
import { Tabs } from "flowbite-react";
import { RiLoginCircleFill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";


function CheckoutForm() { // Formulário de checkout
  return (
    <div className="flex justify-center">
      <Tabs aria-label="Default tabs" className="mx-auto">
        <Tabs.Item active title="Login" icon={RiLoginCircleFill}>
          <LoginCard />
        </Tabs.Item>
        <Tabs.Item title="Register" icon={RxAvatar}>
          <RegisterCard />
        </Tabs.Item>
      </Tabs>
    </div>
  );
}

export default CheckoutForm;
