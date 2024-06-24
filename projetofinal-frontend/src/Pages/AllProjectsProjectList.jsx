import React, { useEffect, useState } from "react";
import AllProjectsTable from "../Components/AllProjectsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";

function AllprojectsProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);

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

  const downloadPdf = async () => {
    try {
      const headers = {
        Accept: "application/octet-stream",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/pdf/generate`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        console.log("HTTP error! status:", response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "application_statistics.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-14">
        <AllProjectsTable
          data={projects}
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
        <button
          onClick={downloadPdf}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default AllprojectsProjectList;
