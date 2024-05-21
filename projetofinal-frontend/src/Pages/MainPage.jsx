import React from "react";
import { ImProfile } from "react-icons/im";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrResources } from "react-icons/gr";
import { Tabs } from "flowbite-react";

function MainPage() {
  return (
    <div className="flex justify-center">
      <Tabs aria-label="Default tabs" className="mx-auto">
        <Tabs.Item active title="MyProfile" icon={ImProfile}></Tabs.Item>
        <Tabs.Item
          title="All Projects"
          icon={AiOutlineFundProjectionScreen}
        ></Tabs.Item>
        <Tabs.Item title="Components/Resources" icon={GrResources}></Tabs.Item>
      </Tabs>
    </div>
  );
}

export default MainPage;
