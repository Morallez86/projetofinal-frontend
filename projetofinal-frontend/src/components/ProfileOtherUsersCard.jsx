import { Card, Label, Avatar, Tooltip, Button, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import { useParams } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import basePhoto from "../Assets/092.png";
import { jwtDecode } from "jwt-decode";

function ProfileOtherUsersCard() {
  const { userId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  

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
    fetchUserInfo();
  }, [userId]);

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
      } else {
        console.error("Error fetching user image");
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
      setProfileImage(basePhoto);
    }
  };

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
        fetchUserInfo();
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
    <Card className="bg-gray-200 transition-colors px-4 duration-200 w-1/2 h-100vh border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-white rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-2">User Profile</h1>
      <div className="flex flex-col pb-10">
        <div className="relative flex items-center space-x-10 justify-center">
          {currentUserRole === 200 && (
            <MdOutlineEdit
              className="h-6 w-6 text-black cursor-pointer absolute top-3 right-6 transform translate-x-1/2 -translate-y-1/2"
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
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-4">
            <Label htmlFor="name" value="Name" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.name}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="jobLocation" value="Job Location" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.jobLocation}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="nickname" value="Nickname" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.nickname}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="biography" value="Biography" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.biography}
            </p>
          </div>
          <div className="mt-4">
            <Label htmlFor="visibility" value="Visibility" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.visibility ? "Public" : "Private"}
            </p>
          </div>
          {editMode && currentUserRole === 200 && (
            <div className="mt-4">
              <Label htmlFor="role" value="Role" />
              <Select
                id="role"
                name="role"
                value={userInfo.role}
                onChange={handleInputChange}
              >
                <option value={100}>User</option>
                <option value={200}>Admin</option>
              </Select>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="skills" value="Skills" />
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
                  content="Check all skills"
                  place="top"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="interests" value="Interests" />
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
                    content="Check all interests"
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {editMode && (
          <div className="flex justify-end mt-4">
            <Button className="mr-2" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleSaveClick}>Save</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ProfileOtherUsersCard;
