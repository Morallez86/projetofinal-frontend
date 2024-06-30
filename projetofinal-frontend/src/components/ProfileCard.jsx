import {
  Card,
  TextInput,
  Label,
  Button,
  Textarea,
  Avatar,
  FileInput,
  Select,
  Dropdown,
} from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useWorkplaceStore from "../Stores/WorkplaceStore";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LuPlusCircle } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import { MdOutlineRemoveCircleOutline, MdOutlineEdit } from "react-icons/md";
import useApiStore from "../Stores/ApiStore";
import {useTranslation} from "react-i18next";

function ProfileCard({
  openPopUpSkills,
  openPopUpInterests,
  openPopUpSkillsRemove,
  openPopUpInterestRemove,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  let userId = null;
  let email = null;
  if (token !== null) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    email = decodedToken.sub;
  }
  const setSkills = useUserStore((state) => state.setSkills);
  const setInterests = useUserStore((state) => state.setInterests);
  const userSkills = useUserStore((state) => state.skills);
  const userInterests = useUserStore((state) => state.interests);
  const setProfileImage = useUserStore((state) => state.setProfileImage);
  const initialProfileImage = useUserStore((state) => state.profileImage);
  const workplaces = useWorkplaceStore((state) => state.workplaces);

  const {t} = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImageLocal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    jobLocation: "",
    nickname: "",
    visibility: true,
    skills: [],
    interests: [],
    biography: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSelectedImage(file);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      skills: userSkills.map((skill) => skill.name),
    }));
  }, [userSkills]);

  useEffect(() => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      interests: userInterests.map((interest) => interest.name),
    }));
  }, [userInterests]);

  useEffect(() => {
    if (initialProfileImage) {
      setProfileImageLocal(initialProfileImage);
    }
  }, [initialProfileImage]);

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
        console.log("User with this token is not found");
      } else if (response.status === 200) {
        const userInfoData = await response.json();
        console.log(userInfoData);
        setSkills(userInfoData.skills);
        setInterests(userInfoData.interests);
        setUserInfo({
          name: `${userInfoData.firstName} ${userInfoData.lastName}`,
          nickname: userInfoData.username,
          biography: userInfoData.biography,
          jobLocation: userInfoData.workplace,
          visibility: userInfoData.visibility,
          skills: userInfoData.skills.map((skill) => skill.name),
          interests: userInfoData.interests.map((interest) => interest.name),
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      console.log(selectedImage);
      if (selectedImage) {
        console.log(email);
        const fileInput = document.getElementById("small-file-upload");
        const file = fileInput.files[0];

        const imageResponse = await fetch(`${apiUrl}/users/image`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            filename: file.name,
            email: email,
          },
          body: file,
        });

        if (imageResponse.status === 200) {
          console.log("Image uploaded successfully");
        } else {
          console.log("Image upload failed");
        }
      }

      // Update the user info
      const response = await fetch(`${apiUrl}/users/profile/${userId}`, {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: userInfo.name.split(" ")[0],
          lastName: userInfo.name.split(" ")[1],
          username: userInfo.nickname,
          biography: userInfo.biography,
          workplace: userInfo.jobLocation,
          visibility: userInfo.visibility,
        }),
      });

      if (response.status === 200) {
        console.log("User info updated successfully");
        setEditMode(false);
      } else {
        console.error("Error updating user info");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <Card className="bg-gray-200 transition-colors px-4 duration-200 w-1/2 h-100vh border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-white rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-2">{t('MyProfile')}</h1>
      <div className="flex flex-col pb-10 ">
        <div className="relative flex items-center  justify-center">
          <MdOutlineEdit
            className="h-6 w-6 text-black cursor-pointer absolute top-3 right-6 transform translate-x-1/2 -translate-y-1/2"
            onClick={handleEditClick}
          />
          <Avatar
            img={profileImage}
            alt="avatar"
            size="xl"
            className="border border-black rounded-full  mb-2"
          />
          {editMode && (
            <FileInput
              id="small-file-upload"
              sizing="sm"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-4">
            <Label
              htmlFor="name"
              value={t('Name')}
              className="font-semibold text-base"
            />
            {editMode ? (
              <TextInput
                id="name"
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                className="text-sm text-gray-500 dark:text-gray-400"
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {userInfo.name}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label
              htmlFor="jobLocation"
              value={t('JobLocation')}
              className="font-semibold text-base"
            />
            {editMode ? (
              <Dropdown
                label={userInfo.jobLocation || t('SelectWorkplace')}
                dismissOnClick={true}
                onSelect={(workplace) =>
                  setUserInfo((prevInfo) => ({
                    ...prevInfo,
                    jobLocation: workplace,
                  }))
                }
              >
                {workplaces.map((workplace) => (
                  <Dropdown.Item
                    key={workplace.id}
                    value={workplace.name}
                    onClick={() =>
                      setUserInfo((prevInfo) => ({
                        ...prevInfo,
                        jobLocation: workplace.name,
                      }))
                    }
                  >
                    {workplace.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {userInfo.jobLocation}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label
              htmlFor="nickname"
              value={t('Nickname')}
              className="font-semibold text-base"
            />
            {editMode ? (
              <TextInput
                id="nickname"
                type="text"
                name="nickname"
                value={userInfo.nickname}
                onChange={handleChange}
                className="text-sm text-gray-500 dark:text-gray-400"
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {userInfo.nickname}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label
              htmlFor="visibility"
              value={t('Visibility')}
              className="font-semibold text-base"
            />
            {editMode ? (
              <Select
                id="visibility"
                name="visibility"
                value={userInfo.visibility.toString()}
                onChange={handleChange}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                <option value="true">{t('Public')}</option>
                <option value="false">{t('Private')}</option>
              </Select>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {userInfo.visibility ? t('Public') : t('Private')}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Label
            htmlFor="biography"
            value={t('Biography')}
            className="font-semibold text-base"
          />
          {editMode ? (
            <Textarea
              id="biography"
              name="biography"
              value={userInfo.biography}
              onChange={handleChange}
              className="text-sm text-gray-500 dark:text-gray-400 truncate"
              rows={4}
            />
          ) : (
            <Textarea
              id="biography"
              name="biography"
              value={userInfo.biography}
              onChange={handleChange}
              className="text-sm text-gray-500 dark:text-gray-400 truncate"
              disabled
              rows={4}
            />
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Label
              htmlFor="skills"
              value={t('Skills')}
              className="font-semibold text-base"
            />
            <div
              id="icon-element"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpSkills}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              id="icon-element-remove"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpSkillsRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element"
              content={t('AddNewSkill')}
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove"
              content={t('RemoveSkill')}
              place="top"
            />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <p className="truncate">
              {Array.isArray(userInfo.skills)
                ? userInfo.skills.slice(-7).join(", ")
                : ""}
            </p>
            {Array.isArray(userInfo.skills) && userInfo.skills.length > 7 && (
              <div id="tip-all-skills">
                <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                  {`+${userInfo.skills.length - 7}`}
                </button>
                <Tooltip
                  anchorSelect="#tip-all-skills"
                  content={t('CheckAllSkills')} 
                  place="top"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Label
              htmlFor="interests"
              value={t('Interests')}
              className="font-semibold text-base"
            />
            <div
              id="icon-element-interests"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpInterests}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              id="icon-element-remove-interest"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpInterestRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element-interests"
              content={t('AddNewInterest')}
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove-interest"
              content={t('RemoveInterest')}
              place="top"
            />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <p className="truncate">
              {Array.isArray(userInfo.interests)
                ? userInfo.interests.slice(-7).join(", ")
                : ""}
            </p>
            {Array.isArray(userInfo.interests) &&
              userInfo.interests.length > 7 && (
                <div id="tip-all-interests">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${userInfo.interests.length - 7}`}
                  </button>
                  <Tooltip
                    anchorSelect="#tip-all-interests"
                    content={t('CheckAllInterests')}
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
        {editMode && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveClick} className="px-2 mr-2">
              {t('Save')}
            </Button>
            <Button onClick={handleCancelClick} className="bg-gray-700">
              {t('Cancel')}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ProfileCard;
