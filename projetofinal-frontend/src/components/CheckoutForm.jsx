import React from "react";
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { RiLoginCircleFill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import LoginCard from "./LoginCard";


function CheckoutForm() {
  return (
    <div className="flex justify-center">
      <Tabs aria-label="Default tabs" style="default" className="mx-auto">
        <Tabs.Item active title="Login" icon={RiLoginCircleFill}>
          <LoginCard/>
        </Tabs.Item>
        <Tabs.Item title="Register" icon={RxAvatar}>

        </Tabs.Item>
      </Tabs>
    </div>
  );
}

export default CheckoutForm;
