import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import ProjectMyProfileTable from "../Components/ProjectMyProfileTable";
import useApiStore from '../Stores/ApiStore';
import useUserStore from "../Stores/UserStore";
import { jwtDecode } from "jwt-decode";

function MyProfileMyProjects() {
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const apiUrl = useApiStore.getState().apiUrl;
  let userId

  if (token) {
        try {
          const decodedToken = jwtDecode(token);
          userId = decodedToken.id;
        } catch (error) {
          console.error("Invalid token", error);
        }
  }

  useEffect(() => {
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

  const handleRowClick = (projectId) => {
    navigate(`/home/${projectId}/ganttChart`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={0} />
      <div className="p-14">
        <ProjectMyProfileTable
          data={projects}
          onRowClick={handleRowClick}
          loading={loading}
          pagination
          paginationServer
          paginationTotalRows={totalPages}
          onChangePage={(newPage) => setPage(newPage)}
          onChangeRowsPerPage={(newRowsPerPage) => setRowsPerPage(newRowsPerPage)}
          rowsPerPage={rowsPerPage}
        />
      </div>
    </div>
  );
}

export default MyProfileMyProjects;
