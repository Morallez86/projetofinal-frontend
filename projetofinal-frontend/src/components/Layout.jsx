import React, { useEffect } from "react";
import { ImProfile } from "react-icons/im";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { GrResources } from "react-icons/gr";
import { PiProjectorScreenChartLight, PiUsersThreeBold } from "react-icons/pi";
import { Tabs } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";
import { CiSettings, CiBoxList } from "react-icons/ci";
import { VscTools } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { Avatar } from "flowbite-react";
import { MdWavingHand, MdOutlineMessage } from "react-icons/md";
import { TbLogout2, TbLogin2 } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import useUserStore from "../Stores/UserStore";
import criticalLogo from "../Assets/CriticalLogo.jpg";
import useApiStore from "../Stores/ApiStore";
import { jwtDecode } from "jwt-decode";
import { ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import i18n from "../Language/i18n";

function Layout({
  activeTab,
  activeSubTabProfile,
  activeSubProjects,
  activeSubComponents,
  unreadMessages,
  unreadNotifications,
  children,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const { token, setToken, profileImage, setProfileImage, clearProfileImage } =
    useUserStore();
  const projectTimestamps = useUserStore((state) => state.projectTimestamps);
  const [switch2, setSwitch2] = useState(false);
  const languageApp = useUserStore((state) => state.language);
  const setLanguageApp = useUserStore((state) => state.setLanguage);
  const navigate = useNavigate();
  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  const handleLanguageToggle = () => {
    const newLanguage = languageApp === "en" ? "pt" : "en";
    setLanguageApp(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  useEffect(() => {
    console.log(projectTimestamps);
  }, [projectTimestamps]);

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
          } else if (response.status === 401) {
            const data = await response.json();
            const errorMessage = data.message || "Unauthorized";

            if (errorMessage === "Invalid token") {
              handleSessionTimeout(); // Session timeout
              return; // Exit early if session timeout
            } else {
              console.error("Error updating seen status:", errorMessage);
            }
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
    console.log(token);
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectTimestamps }),
        });

        if (response.ok) {
          console.log(token);
          setToken(null);
          clearProfileImage();
          navigate("/");
        } else {
          console.log(token);
          setToken(null); // Clear the token even if logout fails
          navigate("/");
        }
      } catch (error) {
        console.log(token);
        setToken(null); // Clear the token on error
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 p-4 px-8">
        <div className="flex flex-col items-start">
          <img
            src={criticalLogo}
            alt="Critical Logo"
            className="w-32 rounded border border-gray-600 h-auto"
          />
          {token && username && (
            <div className="flex items-center space-x-2 mt-4">
              <MdWavingHand size={20} />
              <h1 className="text-black font-bold">Hey {username}</h1>
            </div>
          )}
        </div>
        {token ? (
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
              <Tabs.Item
                value={0}
                title="MyProfile"
                icon={ImProfile}
              ></Tabs.Item>
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
                      title={
                        <span className="text-black">Change Password</span>
                      }
                      icon={CiSettings}
                    ></Tabs.Item>
                    <Tabs.Item
                      active={activeSubTabProfile === 2}
                      value={2}
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
                        case 2:
                          navigate("/users");
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
                    <Tabs.Item
                      active={activeSubProjects === 2}
                      value={2}
                      title={<span className="text-black">Users</span>}
                      icon={PiUsersThreeBold}
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
        ) : (
          <div></div>
        )}
        <div className="flex justify-end items-start space-x-2">
          {token && (
            <>
              <div className="relative mt-3 mr-0 p-0">
                <ToggleSwitch
                  checked={languageApp === "pt"}
                  label={languageApp === "en" ? "Change to PT" : "Change to EN"}
                  onChange={() => {
                    handleLanguageToggle();
                    setSwitch2((prevState) => !prevState);
                  }}
                />
              </div>
              <div className="relative mt-3 cursor-pointer">
                <MdOutlineMessage
                  size={35}
                  onClick={() => navigate("/messages")}
                />
                {unreadMessages > 0 && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {unreadMessages}
                  </div>
                )}
              </div>
              <div className="relative mt-3 cursor-pointer">
                <IoIosNotificationsOutline
                  size={35}
                  onClick={() => navigate("/notifications")}
                />
                {unreadNotifications > 0 && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </div>
                )}
              </div>
              <Avatar img={profileImage} alt="avatar" rounded />
              <button
                className="p-2 flex border mt-1 border-gray-600 hover:bg-cyan-700 items-center justify-center rounded-full bg-white transition-colors duration-200 text-black font-bold"
                onClick={handleLogout}
              >
                <TbLogout2 size={35} />
              </button>
            </>
          )}
          {!token && (
            <>
              <div className="relative mt-3 mr-0 p-0">
                <ToggleSwitch
                  checked={languageApp === "pt"}
                  label={languageApp === "en" ? "Change to PT" : "Change to EN"}
                  onChange={() => {
                    handleLanguageToggle();
                    setSwitch2((prevState) => !prevState);
                  }}
                />
              </div>
              <button
                className="p-2 flex border border-gray-600 hover:bg-cyan-700 hover:text-white items-center justify-center rounded-full bg-white transition-colors duration-200 text-black font-bold"
                onClick={() => navigate("/Login")}
              >
                <TbLogin2 size={35} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default Layout;
