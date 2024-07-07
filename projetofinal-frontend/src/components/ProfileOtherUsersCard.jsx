import { Card, Label, Avatar, Tooltip, Button, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import { useParams } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import basePhoto from "../Assets/092.png";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ProfileOtherUsersCard() {
  const { userId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();
  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  const { t } = useTranslation();

  let currentUserRole;
  if (token) {
    const decodedToken = jwtDecode(token);
    currentUserRole = decodedToken.role;
  }

  const [userInfo, setUserInfo] = useState({
    name: "",
    jobLocation: "",
    nickname: "",
    visibility: true,
    skills: [],
    interests: [],
    biography: "",
    role: 100,
  });
  const [profileImage, setProfileImage] = useState(basePhoto);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/profile/${userId}`, {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          console.log("User with this ID is not found");
        } else if (response.status === 200) {
          const userInfoData = await response.json();
          console.log(userInfoData);
          setUserInfo({
            name: `${userInfoData.firstName} ${userInfoData.lastName}`,
            nickname: userInfoData.username,
            biography: userInfoData.biography,
            jobLocation: userInfoData.workplace,
            visibility: userInfoData.visibility,
            skills: userInfoData.skills.map((skill) => skill.name),
            interests: userInfoData.interests.map((interest) => interest.name),
            role: userInfoData.role,
          });
          fetchProfileImage(userId);
        } else if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Session timeout
            return; // Exit early if session timeout
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchProfileImage = async (userId) => {
      try {
        const response = await fetch(`${apiUrl}/users/${userId}/image`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const imageData = await response.blob();
          const imageObjectURL = URL.createObjectURL(imageData);
          setProfileImage(imageObjectURL);
        } else if (response.status === 404) {
          console.log("User image not found, using base photo");
          setProfileImage(basePhoto);
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
          console.error("Error fetching user image");
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
        setProfileImage(basePhoto);
      }
    };

    fetchUserInfo();
  }, [apiUrl, token, userId]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleSaveClick = async () => {
    const updatedData = {
      role: userInfo.role,
    };

    try {
      const response = await fetch(`${apiUrl}/users/role/${userId}`, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.status === 200) {
        setEditMode(false);
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          role: updatedData.role,
        }));
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
        console.error("Error saving user info");
      }
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  return (
    <Card className="bg-gray-200 transition-colors px-4 duration-200 w-full sm:w-3/4 md:w-1/2 h-auto sm:h-100vh border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-white rounded-lg">
  <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
    {t("userProfile")}
  </h1>
  <div className="flex flex-col pb-10">
    <div className="relative flex items-center space-x-4 sm:space-x-10 justify-center">
      {currentUserRole === 200 && (
        <MdOutlineEdit
          className="h-5 w-5 sm:h-6 sm:w-6 text-black cursor-pointer absolute top-2 sm:top-3 right-4 sm:right-6 transform translate-x-1/2 -translate-y-1/2"
          onClick={handleEditClick}
        />
      )}
      <Avatar
        img={profileImage}
        alt="avatar"
        size="xl"
        className="border border-black rounded-full mb-2"
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mt-4">
            <Label htmlFor="name" value={t("Name")} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.name}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="jobLocation" value={t("jobLocaltion")} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.jobLocation}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="nickname" value={t("Username")} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.nickname}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="biography" value={t("Biography")} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.biography}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="visibility" value={t("Visibility")} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.visibility ? t("Public") : t("Private")}
            </p>
          </div>
          {editMode && currentUserRole === 200 && (
            <div className="mt-4">
              <Label htmlFor="role" value={t("Role")} />
              <Select
                id="role"
                name="role"
                value={userInfo.role}
                onChange={handleInputChange}
              >
                <option value={100}>{t("User")}</option>
                <option value={200}>{t("Admin")}</option>
              </Select>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="skills" value={t("Skills")} />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {Array.isArray(userInfo.skills)
                ? userInfo.skills.slice(-5).join(", ")
                : ""}
            </p>
            {Array.isArray(userInfo.skills) && userInfo.skills.length > 5 && (
              <div id="tip-all-skills">
                <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                  {`+${userInfo.skills.length - 5}`}
                </button>
                <Tooltip
                  anchorSelect="#tip-all-skills"
                  content={t("CheckAllSkills")}
                  place="top"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="interests" value={t("Interests")} />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {Array.isArray(userInfo.interests)
                ? userInfo.interests.slice(-5).join(", ")
                : ""}
            </p>
            {Array.isArray(userInfo.interests) &&
              userInfo.interests.length > 5 && (
                <div id="tip-all-interests">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${userInfo.interests.length - 5}`}
                  </button>
                  <Tooltip
                    anchorSelect="#tip-all-interests"
                    content={t("CheckAllInterests")}
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {editMode && (
          <div className="flex justify-end mt-4">
            <Button className="mr-2" onClick={handleCancelClick}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleSaveClick}>{t("Save")}</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ProfileOtherUsersCard;
