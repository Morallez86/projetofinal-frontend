import React, { useEffect } from "react";
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
import useApiStore from "../Stores/ApiStore";
import { TbLogin2 } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";

function Layout({
  activeTab,
  activeSubTabProfile,
  activeSubProjects,
  activeSubComponents,
}) {
  const navigate = useNavigate();
  const apiUrl = useApiStore((state) => state.apiUrl);
  const { token, setToken, profileImage, setProfileImage, clearProfileImage } = useUserStore();

  let userId, username;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
      username = decodedToken.username;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  useEffect(() => {
     const fetchProfileImage = async () => {
      if (token && userId) {
        try {
          const response = await fetch(`${apiUrl}/users/${userId}/image`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setProfileImage(imageObjectURL);
          } else {
            console.error("Failed to fetch profile image:", response.status);
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };

    fetchProfileImage();
  }, [apiUrl, token, userId, setProfileImage]);

  const handleLogout = async () => {
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setToken(null);
          clearProfileImage();
          navigate("/");
        } else {
          setToken(null); // Clear the token even if logout fails
          navigate("/");
        }
      } catch (error) {
        setToken(null); // Clear the token on error
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="grid grid-cols-[1fr_3fr_1fr] gap-4 p-4">
      <div className="flex flex-col items-start">
        <img src={criticalLogo} alt="Critical Logo" className="w-32 rounded h-auto" />
        {username && (
          <div className="flex items-center space-x-2 mt-4">
            <MdWavingHand size={20} />
            <h1 className="text-black font-bold">Hey {username}</h1>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <Tabs
          aria-label="Full width tabs"
          variant="fullWidth"
          defaultValue={activeTab}
          onActiveTabChange={(value) => {
            switch (value) {
              case 0:
                navigate("/myProjects");
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
                      navigate("/myProjects");
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
                      navigate("/");
                      break;
                    default:
                      break;
                  }
                }}
              >
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
      <div className="flex justify-end items-start space-x-2">
        <Avatar img={profileImage} alt="avatar" rounded />
        {token ? (
          <Button
            className="p-0 flex items-center justify-center bg-transparent hover:bg-orange-200 transition-colors duration-200 text-black font-bold"
            onClick={handleLogout}
          >
            <TbLogout2 size={35} />
          </Button>
        ) : (
          <Button
            className="p-0 flex items-center justify-center bg-transparent hover:bg-orange-200 transition-colors duration-200 text-black font-bold"
            onClick={() => navigate("/Login")}
          >
            <TbLogin2 size={35} />
          </Button>
        )}
      </div>
    </div>
  );
}

export default Layout;
