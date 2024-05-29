import React from "react";
import { ImProfile } from "react-icons/im";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrResources } from "react-icons/gr";
import { PiProjectorScreenChartLight } from "react-icons/pi";
import { Tabs } from "flowbite-react";
import { GiSkills } from "react-icons/gi";
import { LuMessagesSquare } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { CiBoxList } from "react-icons/ci";
import { VscTools } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { Avatar, Button } from "flowbite-react";
import { MdWavingHand } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import useUserStore from "../Stores/UserStore";
import criticalLogo from "../Assets/CriticalLogo.jpg";
import useApiStore from '../Stores/ApiStore';
import { TbLogin2 } from "react-icons/tb";



function Layout({
  activeTab,
  activeSubTabProfile,
  activeSubProjects,
  activeSubComponents,
}) {
const navigate = useNavigate();
const apiUrl = useApiStore((state) => state.apiUrl);
const { token, setToken } = useUserStore();
  

  const handleLogout = async () => {
    try {
      console.log(token);
      const response = await fetch(`${apiUrl}/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Clear the token and redirect to login page
        setToken(null);
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(`Failed to logout: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error logging out", error);
      alert("Error logging out");
    }
  };

  return (
    <div className="grid grid-cols-[1fr_3fr_1fr] gap-4 p-4">
      <div className="flex flex-col items-start">
        <img src={criticalLogo} alt="Critical Logo" className="w-32 rounded h-auto" />
        <div className="flex items-center space-x-2 mt-4">
          <MdWavingHand size={20} />
          <h1 className="text-black font-bold">Hey Elias98</h1>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Tabs
          aria-label="Full width tabs"
          variant="fullWidth"
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

        <div className="w-full max-w-3xl">
          {activeTab === 0 && (
            <div>
              <Tabs
                aria-label="Pills"
                variant="pills"
                className="w-full"
                defaultValue={activeSubTabProfile}
                onActiveTabChange={(value) => {
                  switch (value) {
                    case 0:
                      navigate("/home");
                      break;
                    case 1:
                      navigate("/changePassword");
                      break;
                    case 2:
                      navigate("/registerSkillInterest");
                      break;
                    case 3:
                      navigate("/messages");
                      break;
                    case 4:
                      navigate("/aboutMe");
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
                  title={<span className="text-black">Change Password</span>}
                  icon={CiSettings}
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
                <Tabs.Item
                  active={activeSubTabProfile === 4}
                  value={4}
                  title={<span className="text-black">About me</span>}
                  icon={CgProfile}
                ></Tabs.Item>
              </Tabs>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <Tabs
                aria-label="Pills"
                variant="pills"
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
                variant="pills"
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
        <div className="flex  justify-end space-x-2">
        <Avatar img="https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg?w=640" alt="avatar" rounded className="items-start" />
        <Button className="mt-2 bg-transparent hover:bg-orange-200 transition-colors duration-200 text-black font-bold" onClick={handleLogout}>
          <TbLogout2 size={30} />
        </Button>
      </div>
    </div>
  );
}
export default Layout;
