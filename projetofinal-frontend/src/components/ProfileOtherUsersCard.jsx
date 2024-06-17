import { Card, Label, Avatar, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import { useParams } from "react-router-dom";

function ProfileOtherUsersCard() {
  const { userId } = useParams();
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);

  const [userInfo, setUserInfo] = useState({
    name: "",
    jobLocation: "",
    nickname: "",
    visibility: true,
    skills: [],
    interests: [],
    biography: "",
  });
  const [profileImage, setProfileImage] = useState(null);

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
        setUserInfo({
          name: `${userInfoData.firstName} ${userInfoData.lastName}`,
          nickname: userInfoData.username,
          biography: userInfoData.biography,
          jobLocation: userInfoData.workplace,
          visibility: userInfoData.visibility,
          skills: userInfoData.skills.map((skill) => skill.name),
          interests: userInfoData.interests.map((interest) => interest.name),
        });
        fetchProfileImage(userId); // Fetch profile image after user info
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
        console.log("User image not found");
      } else {
        console.error("Error fetching user image");
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };

  return (
    <Card className="bg-gray-200 transition-colors duration-200 w-1/2 h-auto">
      <div className="flex flex-col pb-10">
        <div className="relative flex items-center space-x-10 justify-center">
          <Avatar img={profileImage} alt="avatar" size="xl" rounded />
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
      </div>
    </Card>
  );
}

export default ProfileOtherUsersCard;
