import React, { useState } from "react";
import { ImProfile } from "react-icons/im";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrResources } from "react-icons/gr";
import { PiProjectorScreenChartLight } from "react-icons/pi";
import { Tabs } from "flowbite-react";
import { CiEdit } from "react-icons/ci";
import { GiSkills } from "react-icons/gi";
import { LuMessagesSquare } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { VscTools } from "react-icons/vsc";

function Layout({
  activeTab,
  activeSubTabProfile,
  activeSubProjects,
  activeSubComponents,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <Tabs
        aria-label="Full width tabs"
        style="fullWidth"
        defaultValue={activeTab}
        onActiveTabChange={(value) => {
          switch (value) {
            case 0:
              navigate("/home");
              break;
            case 1:
              navigate("/createNewProject");
              break;
            case 2:
              navigate("/components");
              break;
            default:
              break;
          }
        }}
      >
        <Tabs.Item value={0} title="MyProfile" icon={ImProfile}></Tabs.Item>
        <Tabs.Item
          active={activeTab === 1}
          value={1}
          title="All Projects"
          icon={AiOutlineFundProjectionScreen}
        ></Tabs.Item>
        <Tabs.Item
          active={activeTab === 2}
          value={2}
          title="Components/Resources"
          icon={GrResources}
        ></Tabs.Item>
      </Tabs>

      <div className="w-full max-w-2xl">
        {activeTab === 0 && (
          <div>
            <Tabs
              aria-label="Pills"
              style="pills"
              className="w-full"
              defaultValue={activeSubTabProfile}
              onActiveTabChange={(value) => {
                switch (value) {
                  case 0:
                    navigate("/home");
                    break;
                  case 1:
                    navigate("/editProfile");
                    break;
                  case 2:
                    navigate("/registerSkillInterest");
                    break;
                  case 3:
                    navigate("/messages");
                    break;
                  default:
                    break;
                }
              }}
            >
              {console.log("Rendering MyProfile sub-tabs")}
              <Tabs.Item
                active={activeSubTabProfile === 0}
                value={0}
                title={<span className="text-black">My Projects</span>}
                icon={PiProjectorScreenChartLight}
              ></Tabs.Item>
              <Tabs.Item
                active={activeSubTabProfile === 1}
                value={1}
                title={<span className="text-black">Edit Profile</span>}
                icon={CiEdit}
              ></Tabs.Item>
              <Tabs.Item
                active={activeSubTabProfile === 2}
                value={2}
                title={
                  <span className="text-black">Register Skill/Interest</span>
                }
                icon={GiSkills}
              ></Tabs.Item>
              <Tabs.Item
                active={activeSubTabProfile === 3}
                value={3}
                title={<span className="text-black">Messages</span>}
                icon={LuMessagesSquare}
              ></Tabs.Item>
            </Tabs>
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <Tabs
              aria-label="Pills"
              style="pills"
              className="w-full"
              onActiveTabChange={(value) => {
                switch (value) {
                  case 0:
                    navigate("/createNewProject");
                    break;
                  case 1:
                    navigate("/projectsList");
                    break;
                  default:
                    break;
                }
              }}
            >
              {console.log("Rendering All Projects sub-tabs")}
              <Tabs.Item
                active={activeSubProjects === 0}
                value={0}
                title={<span className="text-black">Create New</span>}
                icon={IoCreateOutline}
              ></Tabs.Item>
              <Tabs.Item
                active={activeSubProjects === 1}
                value={1}
                title={<span className="text-black">Projects List</span>}
                icon={CiBoxList}
              ></Tabs.Item>
            </Tabs>
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <Tabs
              aria-label="Pills"
              style="pills"
              className="w-full "
              onActiveTabChange={(value) => {
                switch (value) {
                  case 0:
                    navigate("/components");
                    break;
                  case 1:
                    navigate("/resources");
                    break;
                  default:
                    break;
                }
              }}
            >
              {console.log("Rendering Components/Resources sub-tabs")}
              <Tabs.Item
                active={activeSubComponents === 0}
                value={0}
                title={<span className="text-black">Components</span>}
                icon={VscTools}
              ></Tabs.Item>
              <Tabs.Item
                active={activeSubComponents === 1}
                value={1}
                title={<span className="text-black">Resources</span>}
                icon={GrResources}
              ></Tabs.Item>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
