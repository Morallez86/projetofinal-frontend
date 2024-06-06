import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Layout";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import ProjectDetailsCard from "../Components/ProjectDetailsCard";

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/projects/${projectId}`, {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, apiUrl, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>No project found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubProjects={0} />
    <div className="flex flex-wrap justify-center">
      <div className="w-full md:w-1/4 p-4">
        <ProjectDetailsCard project={project} />
      </div>
      {/* Second card */}
      <div className="w-full md:w-1/2 p-4">
        {/* Content for the second card goes here */}
      </div>
      {/* Third card */}
      <div className="w-full md:w-1/4 p-4">
        {/* Content for the third card goes here */}
      </div>
    </div>
    </div>
  );
}

export default ProjectDetails;
