import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import ProjectDetailsCard from "../Components/ProjectDetailsCard";
import TaskCard from "../Components/TaskCard";
import ActivityLogs from "../Components/ActivityLogs";
import { SiGooglemessages } from "react-icons/si";
import GroupProjectChat from "../Components/GroupProjectChat";
import { motion } from "framer-motion";

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userImages, setUserImages] = useState({});
  const [loading, setLoading] = useState(true);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [team, setTeam] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const projectTimestamps = useUserStore((state) => state.projectTimestamps);
  const setProjectTimestamp = useUserStore(
    (state) => state.setProjectTimestamp
  );

  console.log(projectId);

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
        setTasks(data.tasks || []); // Ensure tasks is an array
        setTeam(data.userProjectDtos || []);
        console.log(data);
        console.log(data.chatMessage);
        if (data.chatMessage) {
          console.log("in");
          console.log(projectTimestamps);
        }
        console.log(unreadMessages);

        const userIds = data.userProjectDtos
          .map((up) => up.userId)
          .filter((value, index, self) => self.indexOf(value) === index); // Unique IDs

        console.log(userIds);

        const imagesResponse = await fetch(`${apiUrl}/users/images`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userIds),
        });

        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          const imagesMap = {};
          imagesData.forEach((img) => {
            imagesMap[img.id] = img;
          });
          setUserImages(imagesMap);
        } else {
          console.error("Error fetching user images");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, apiUrl, token]);

  const getUnreadMessages = () => {
    const projectTimestamp = new Date(projectTimestamps[projectId]);
    let count = 0;

    project.chatMessage.forEach((message) => {
      // Convertendo o array de timestamp para um objeto Date
      const messageDate = new Date(Date.UTC(message.timestamp[0], message.timestamp[1] - 1, message.timestamp[2], message.timestamp[3], message.timestamp[4], message.timestamp[5], message.timestamp[6] / 1000000));
    
      // Comparando as datas
      if (messageDate > projectTimestamp) {
        count++;
      }
    });

    setUnreadMessages(count);
  }

  useEffect(() => {
    if (project && project.chatMessage) {
      getUnreadMessages();
    }
  }, [project, projectTimestamps]);

  console.log(unreadMessages);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>No project found</div>;
  }

  console.log(project.userProjects);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-wrap justify-center">
        <div className="w-full md:w-1/3 p-4">
          <ProjectDetailsCard project={project} userImages={userImages} />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <div className="flex flex-col overflow-y-auto bg-transparent h-[45rem]">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userImages={userImages}
                  projectUsers={project.userProjectDtos}
                  totalTasks={tasks}
                  setTotalTasks={setTasks}
                />
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4">
          <ActivityLogs
            tasks={tasks}
            projectId={project.id}
            logs={project.historyrecords}
          />
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "25px",
          zIndex: "1000",
        }}
      >
        <button
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (!isChatOpen) {
              const projectId = project.id;
              const timestamp = new Date().toISOString();
              setProjectTimestamp(projectId, timestamp);
            }
          }}
        >
          <SiGooglemessages size={60} />
          {unreadMessages > 0 && (
            <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {unreadMessages}
            </div>
          )}
        </button>
      </div>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GroupProjectChat
            photos={userImages}
            users={team}
            messages={project.chatMessage}
          />
        </motion.div>
      )}
    </div>
  );
}

export default ProjectDetails;
