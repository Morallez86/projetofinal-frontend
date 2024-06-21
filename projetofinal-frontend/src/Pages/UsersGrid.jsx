import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Avatar, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import useWorkplaceStore from "../Stores/WorkplaceStore";
import useSkillStore from "../Stores/SkillStore";
import useInterestStore from "../Stores/InterestStore";
import basePhoto from "../Assets/092.png";
import MessageModal from "../Components/MessageModal";

function UsersGrid() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const { token } = useUserStore();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [userImages, setUserImages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkplace, setSelectedWorkplace] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("");
  const [selectedInterests, setSelectedInterests] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user

  const workplaces = useWorkplaceStore((state) => state.workplaces);
  const skills = useSkillStore((state) => state.skills);
  const interests = useInterestStore((state) => state.interests);

  const fetchUserImages = useCallback(
    async (users) => {
      const userIds = users.map((user) => user.id);
      try {
        const response = await fetch(`${apiUrl}/users/images`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userIds),
        });

        if (response.ok) {
          const imagesData = await response.json();
          const imagesMap = {};
          imagesData.forEach((img) => {
            imagesMap[img.id] = img;
          });
          setUserImages(imagesMap);
        } else {
          console.error("Error fetching user images");
        }
      } catch (error) {
        console.error("Error fetching user images:", error);
      }
    },
    [apiUrl, token]
  );

  const fetchUsers = useCallback(
    async (searchTerm = "", filters = {}) => {
      let url = `${apiUrl}/users`;
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      if (filters.workplace) {
        params.append("workplace", filters.workplace);
      }
      if (filters.skills) {
        params.append("skills", filters.skills);
      }
      if (filters.interests) {
        params.append("interests", filters.interests);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            setUsers(data);
            await fetchUserImages(data);
          } else {
            setUsers([]);
            console.warn("No users found.");
          }
        } else {
          console.error("Error fetching users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    [apiUrl, token, fetchUserImages]
  );

  // Initial fetch on component mount
  useEffect(() => {
    const fetchInitialUsers = async () => {
      await fetchUsers();
    };
    fetchInitialUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    fetchUsers(searchTerm, {
      workplace: selectedWorkplace,
      skills: selectedSkills,
      interests: selectedInterests,
    });
  };

  const handleWorkplaceChange = (value) => setSelectedWorkplace(value);
  const handleSkillsChange = (value) => setSelectedSkills(value);
  const handleInterestsChange = (value) => setSelectedInterests(value);

  const openMessageModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeMessageModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8">
        <div className="flex items-center mb-4">
          <TextInput
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3"
          />
          <select
            id="workplace"
            value={selectedWorkplace}
            onChange={(e) => handleWorkplaceChange(e.target.value)}
            className="mx-2"
          >
            <option value="">Select workplace</option>
            {workplaces.map((workplace) => (
              <option key={workplace.id} value={workplace.name}>
                {workplace.name}
              </option>
            ))}
          </select>
          <select
            id="skills"
            value={selectedSkills}
            onChange={(e) => handleSkillsChange(e.target.value)}
            className="mx-2"
          >
            <option value="">Select skills</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
          <select
            id="interests"
            value={selectedInterests}
            onChange={(e) => handleInterestsChange(e.target.value)}
            className="mx-2"
          >
            <option value="">Select interests</option>
            {interests.map((interest) => (
              <option key={interest.id} value={interest.name}>
                {interest.name}
              </option>
            ))}
          </select>
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="p-4 flex flex-col items-center">
              <Avatar
                img={
                  userImages[user.id]?.image
                    ? `data:${userImages[user.id].type};base64,${
                        userImages[user.id].image
                      }`
                    : basePhoto
                }
                rounded={true}
                size="xl"
              />
              <h3 className="mt-2 text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="mt-4 flex space-x-2">
                {user.visibility ? (
                  <Button
                    size="sm"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    Profile
                  </Button>
                ) : (
                  <Button size="sm" disabled>
                    Profile
                  </Button>
                )}
                <Button size="sm" onClick={() => openMessageModal(user)}>
                  Message
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Render the NewMessageModal */}
      <MessageModal
        isOpen={isModalOpen}
        closeModal={closeMessageModal}
        authToken={token}
        selectedUser={selectedUser}
      />
    </div>
  );
}

export default UsersGrid;
