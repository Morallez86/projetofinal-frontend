import React, { useEffect, useState, useCallback } from "react";
import { Button } from "flowbite-react";
import useApiStore from "./Stores/ApiStore";
import useUserStore from "./Stores/UserStore";
import ProjectsHomeCard from "./Components/ProjectsHomeCard";
import "./general.css";

function App() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const { token } = useUserStore();

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjects = useCallback(
    async (searchTerm = "") => {
      let url = `${apiUrl}/projects`;
      const params = new URLSearchParams();
      console.log(searchTerm);

      if (searchTerm) {
        params.append("searchTerm", searchTerm);
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
    fetchProjects(searchTerm);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8">
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search by project name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 rounded border-gray-600"
          />
          <Button
            onClick={handleSearch}
            className="ml-2"
          >
            Search
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
};


export default App;
