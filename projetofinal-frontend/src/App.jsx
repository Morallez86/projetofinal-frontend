import React, { useEffect, useState } from "react";
import Layout from "./Components/Layout";
import AllProjectsTable from "./Components/AllProjectsTable";
import useApiStore from './Stores/ApiStore';
import useUserStore from "./Stores/UserStore";
import useWorkplaces from "./Hooks/useWorkplaces";
import "./general.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);
  const { workplaces } = useWorkplaces();

  console.log(workplaces);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const headers = {
          Accept: "*/*",
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${apiUrl}/projects?page=${page}&limit=${rowsPerPage}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data.projects);
        setTotalPages(data.totalPages);
        console.log(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, rowsPerPage, apiUrl, token]);

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={1} activeSubProjects={1} />
      <div className="p-14">
        <AllProjectsTable
          data={projects}
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

export default App;
