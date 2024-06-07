// src/Components/ProjectDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Layout";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import ProjectDetailsCard from "../Components/ProjectDetailsCard";
import TaskCard from "../Components/TaskCard";

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  console.log(project);
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
        setTasks(data.tasks); // Assuming project data contains tasks array
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
        <div className="w-full md:w-1/3 p-4">
          <ProjectDetailsCard project={project} />
        </div>
        <div className="w-full md:w-1/3 p-4">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <p>No tasks available</p>
          )}
        </div>
        <div className="w-full md:w-1/3 p-4">
          {/* Sidebar or additional content */}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
