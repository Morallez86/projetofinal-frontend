import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Avatar, TextInput } from "flowbite-react";
import Layout from "../Components/Layout";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";

function UsersGrid() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const { token } = useUserStore();

  const [users, setUsers] = useState([]);
  const [userImages, setUserImages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("");
  const [selectedInterests, setSelectedInterests] = useState("");

  // Define fetchUserImages function
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

  // Define fetchUsers function with filters
  const fetchUsers = useCallback(
    async (searchTerm = "", filters = {}) => {
      let url = `${apiUrl}/users`;
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      if (filters.workspace) {
        params.append("workspace", filters.workspace);
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
          setUsers(data);
          await fetchUserImages(data); // Await for fetchUserImages to complete
        } else {
          console.error("Error fetching users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    [apiUrl, token, fetchUserImages]
  );

  useEffect(() => {
    const fetchInitialUsers = async () => {
      await fetchUsers();
    };

    fetchInitialUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      await fetchUsers(searchTerm, {
        workspace: selectedWorkspace,
        skills: selectedSkills,
        interests: selectedInterests,
      });
    };

    fetchFilteredUsers();
  }, [
    searchTerm,
    selectedWorkspace,
    selectedSkills,
    selectedInterests,
    fetchUsers,
  ]);

  // Handle search button click
  const handleSearch = () => {
    fetchUsers(searchTerm, {
      workspace: selectedWorkspace,
      skills: selectedSkills,
      interests: selectedInterests,
    });
  };

  // Handle dropdown change
  const handleWorkspaceChange = (value) => setSelectedWorkspace(value);
  const handleSkillsChange = (value) => setSelectedSkills(value);
  const handleInterestsChange = (value) => setSelectedInterests(value);

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={1} activeSubProjects={2} />
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
            id="workspace"
            value={selectedWorkspace}
            onChange={(e) => handleWorkspaceChange(e.target.value)}
            className="mx-2"
          >
            <option value="">Select workspace</option>
            {/* Populate options dynamically */}
          </select>
          <select
            id="skills"
            value={selectedSkills}
            onChange={(e) => handleSkillsChange(e.target.value)}
            className="mx-2"
          >
            <option value="">Select skills</option>
            {/* Populate options dynamically */}
          </select>
          <select
            id="interests"
            value={selectedInterests}
            onChange={(e) => handleInterestsChange(e.target.value)}
            className="mx-2"
          >
            <option value="">Select interests</option>
            {/* Populate options dynamically */}
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
                    : "path/to/default/avatar.jpg"
                }
                rounded={true}
                size="xl"
              />
              <h3 className="mt-2 text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="mt-4 flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => alert(`Profile of ${user.name}`)}
                >
                  Profile
                </Button>
                <Button
                  size="sm"
                  onClick={() => alert(`Message to ${user.name}`)}
                >
                  Message
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UsersGrid;
