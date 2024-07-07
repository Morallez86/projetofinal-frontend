import React, { useEffect, useState, useCallback } from "react";
import { Button } from "flowbite-react";
import useApiStore from "./Stores/ApiStore";
import useUserStore from "./Stores/UserStore";
import ProjectsHomeCard from "./Components/ProjectsHomeCard";
import useWorkplaces from "./Hooks/useWorkplaces";
import { useLocation } from "react-router-dom";
import SessionTimeoutModal from "./Components/SessionTimeoutModal"; // Import your modal component
import { useTranslation } from "react-i18next";
import i18n from "../src/Language/i18n";

import "./general.css";

function App() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const {
    token,
    clearToken,
    clearUserId,
    clearProfileImage,
    clearSkills,
    clearInterests,
    clearProjectTimestamps,
    setLanguage,
  } = useUserStore();
  const { t } = useTranslation();
  const location = useLocation();
  const [showSessionModal, setShowSessionModal] = useState(false);

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  useWorkplaces();

  const fetchGreeting = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/greetings",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }

      const data = await response.json();
      console.log(data);

      const languageCode = data.locale.substring(0, 2);
      console.log(languageCode);
      setLanguage(languageCode);

      i18n.changeLanguage(languageCode);
    } catch (error) {
      console.error("Erro ao buscar a saudação:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchGreeting();
  }, []);

  useEffect(() => {
    if (location.state?.showSessionTimeoutModal) {
      setShowSessionModal(true);
    }
  }, [location.state]);

  const fetchProjects = useCallback(
    async (searchTerm = "", skills = "", interests = "") => {
      let url = `${apiUrl}/projects`;
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("searchTerm", searchTerm);
      }
      if (skills) {
        params.append("skills", skills);
      }
      if (interests) {
        params.append("interests", interests);
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
          setProjects(data.projects);
        } else {
          console.error("Error fetching projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    [apiUrl, token]
  );

  useEffect(() => {
    const fetchInitialProjects = async () => {
      await fetchProjects();
    };
    fetchInitialProjects();
  }, [fetchProjects]);

  const handleSearch = () => {
    fetchProjects(searchTerm, skills, interests);
  };

  const handleLogout = () => {
    clearToken();
    clearUserId();
    clearProfileImage();
    clearSkills();
    clearInterests();
    clearProjectTimestamps();
    setShowSessionModal(false); // Hide modal after logout
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SessionTimeoutModal show={showSessionModal} onLogout={handleLogout} />

      <div className="p-8">
        <div className="flex items-center mb-4 space-x-2">
          <input
            type="text"
            placeholder={t("Search by project name")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/4 rounded border-gray-600"
          />
          <input
            type="text"
            placeholder={t("Search by skills")}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-1/4 rounded border-gray-600"
          />
          <input
            type="text"
            placeholder={t("Search by interests")}
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-1/4 rounded border-gray-600"
          />
          <Button onClick={handleSearch} className="ml-2">
            {t("Search")}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectsHomeCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
