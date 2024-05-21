import React, { useState } from "react";
import { ImProfile } from "react-icons/im";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrResources } from "react-icons/gr";
import { PiProjectorScreenChartLight } from "react-icons/pi";
import { Tabs } from "flowbite-react";
import { CiEdit } from "react-icons/ci";
import { GiSkills } from "react-icons/gi";
import { LuMessagesSquare } from "react-icons/lu";



function Layout({ activeTab, activeSubTabProfile }) {
  return (
    <div className="flex flex-col items-center">
      <Tabs
        aria-label="Full width tabs"
        style="fullWidth"
        defaultValue={activeTab}
      >
        <Tabs.Item value={0} title="MyProfile" icon={ImProfile}></Tabs.Item>
        <Tabs.Item
          value={1}
          title="All Projects"
          icon={AiOutlineFundProjectionScreen}
        ></Tabs.Item>
        <Tabs.Item
          value={2}
          title="Components/Resources"
          icon={GrResources}
        ></Tabs.Item>
      </Tabs>

      <div className="w-full max-w-2xl">
        {activeTab === 0 && (
          <div>
            <Tabs aria-label="Pills" style="pills" className="w-full" defaultValue={activeSubTabProfile} >
              {console.log("Rendering MyProfile sub-tabs")}
              <Tabs.Item
              value={0}
                title={<span className="text-black">My Projects</span>}
                icon={PiProjectorScreenChartLight}
              ></Tabs.Item>
              <Tabs.Item
              value={1}
                title={<span className="text-black">Edit Profile</span>}
                icon={CiEdit}
              ></Tabs.Item>
              <Tabs.Item
                value={2}
                title={
                  <span className="text-black">Register Skill/Interest</span>
                }
                icon={GiSkills}
              ></Tabs.Item>
              <Tabs.Item
                value={3}
                title={<span className="text-black">Messages</span>}
                icon={LuMessagesSquare}
              ></Tabs.Item>
            </Tabs>
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <Tabs aria-label="Pills" style="pills" className="w-full">
              {console.log("Rendering All Projects sub-tabs")}
              <Tabs.Item
                title={<span className="text-black">Create New</span>}
              ></Tabs.Item>
              <Tabs.Item
                title={<span className="text-black">Projects List</span>}
              ></Tabs.Item>
            </Tabs>
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <Tabs aria-label="Pills" style="pills" className="w-full ">
              {console.log("Rendering Components/Resources sub-tabs")}
              <Tabs.Item
                title={<span className="text-black">Components</span>}
              ></Tabs.Item>
              <Tabs.Item
                title={<span className="text-black">Resources</span>}
              ></Tabs.Item>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
