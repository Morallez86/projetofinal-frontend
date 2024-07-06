import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectMyProfileTable from "../Components/ProjectMyProfileTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import useSkills from "../Hooks/useSkills";
import useInterests from "../Hooks/useInterests";
import { jwtDecode } from "jwt-decode";

const useProjects = (userId, page, rowsPerPage) => {
  const navigate = useNavigate();
  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const { skills } = useSkills();
  const { interests } = useInterests();
  const setProjectTimestamp = useUserStore(
    (state) => state.setProjectTimestamp
  );
  const projectTimestamps = useUserStore((state) => state.projectTimestamps);

  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        if (decodedToken.projectTimestamps) {
          Object.entries(decodedToken.projectTimestamps).forEach(
            ([projectId, timestamp]) => {
              setProjectTimestamp(projectId, timestamp);
            }
          );
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
  }, [token, setProjectTimestamp]);

  console.log(projectTimestamps);

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/users/${userId}/myProjects?page=${page}&limit=${rowsPerPage}`,
          {
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Session timeout
            return; // Exit early if session timeout
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data.projects);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, rowsPerPage, apiUrl, token, userId]);

  return { projects, loading, totalPages };
};

function MyProfileMyProjects() {
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.id : null;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { projects, loading, totalPages } = useProjects(
    userId,
    page,
    rowsPerPage
  );

  const handleRowClick = (projectId) => {
    navigate(`/myProjects/${projectId}/ganttChart`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-14">
        <ProjectMyProfileTable
          data={projects}
          onRowClick={handleRowClick}
          loading={loading}
          pagination
          paginationServer
          paginationTotalRows={totalPages * rowsPerPage}
          onChangePage={(newPage) => setPage(newPage)}
          onChangeRowsPerPage={(newRowsPerPage) =>
            setRowsPerPage(newRowsPerPage)
          }
          rowsPerPage={rowsPerPage}
        />
      </div>
    </div>
  );
}

export default MyProfileMyProjects;
