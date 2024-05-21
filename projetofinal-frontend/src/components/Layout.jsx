import React from "react";
import { ImProfile } from "react-icons/im";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrResources } from "react-icons/gr";
import { Tabs } from "flowbite-react";

function Layout({activeTab}) {
  return (
    <div className="flex flex-col items-center">
      <Tabs aria-label="Default tabs" className="w-full max-w-xl">
        <Tabs.Item
          active={activeTab === 0}
          title="MyProfile"
          icon={ImProfile}
        ></Tabs.Item>
        <Tabs.Item
          active={activeTab === 1}
          title="All Projects"
          icon={AiOutlineFundProjectionScreen}
        ></Tabs.Item>
        <Tabs.Item
          active={activeTab === 2}
          title="Components/Resources"
          icon={GrResources}
        ></Tabs.Item>
      </Tabs>

      <div className="mt-4 w-full max-w-xl">
        {activeTab === 0 && (
          <Tabs aria-label="MyProfile sub-tabs" className="w-full">
            {console.log("Rendering MyProfile sub-tabs")}
            <Tabs.Item title="My Projects"></Tabs.Item>
            <Tabs.Item title="Edit Profile"></Tabs.Item>
            <Tabs.Item title="Register Skill/Interest"></Tabs.Item>
            <Tabs.Item title="Messages"></Tabs.Item>
          </Tabs>
        )}
        {activeTab === 1 && (
          <Tabs aria-label="All Projects sub-tabs" className="w-full">
            {console.log("Rendering All Projects sub-tabs")}
            <Tabs.Item title="Create New"></Tabs.Item>
            <Tabs.Item title="Projects List"></Tabs.Item>
          </Tabs>
        )}
        {activeTab === 2 && (
          <Tabs aria-label="Components/Resources sub-tabs" className="w-full">
            {console.log("Rendering Components/Resources sub-tabs")}
            <Tabs.Item title="Components"></Tabs.Item>
            <Tabs.Item title="Resources"></Tabs.Item>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default Layout;
