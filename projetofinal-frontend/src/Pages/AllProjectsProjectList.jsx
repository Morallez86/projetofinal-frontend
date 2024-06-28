import React, { useEffect, useState, useCallback } from "react";
import AllProjectsTable from "../Components/AllProjectsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { TextInput, Button, Select } from "flowbite-react";
import { jwtDecode } from "jwt-decode";

function AllprojectsProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [status, setStatus] = useState("");
  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);

  let currentUserRole;
  if (token) {
    const decodedToken = jwtDecode(token);
    currentUserRole = decodedToken.role;
  }

  const fetchProjects = useCallback(
    async (searchTerm = "", skills = "", interests = "", status = "") => {
      setLoading(true);
      let url = `${apiUrl}/projects?page=${page}&limit=${rowsPerPage}`;
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
      if (status) {
        params.append("status", status);
      }

      if (params.toString()) {
        url += `&${params.toString()}`;
      }

      try {
        const headers = {
          Accept: "*/*",
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });

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
    },
    [apiUrl, page, rowsPerPage, token]
  );

  useEffect(() => {
    fetchProjects(searchTerm, skills, interests, status);
  }, [fetchProjects, page, rowsPerPage]);

  const handleSearch = () => {
    setPage(1); // Reset to the first page for new searches
    fetchProjects(searchTerm, skills, interests, status);
  };

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
        <div className="flex items-center mb-4 space-x-2">
          <TextInput
            placeholder="Search by project name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/4"
          />
          <TextInput
            placeholder="Search by skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-1/4"
          />
          <TextInput
            placeholder="Search by interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-1/4"
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-1/4"
          >
            <option value="">All Statuses</option>
            <option value="100">PLANNING</option>
            <option value="200">READY</option>
            <option value="300">IN PROGRESS</option>
            <option value="400">FINISHED</option>
            <option value="500">CANCELLED</option>
          </Select>
          <Button onClick={handleSearch} className="ml-2">
            Search
          </Button>
        </div>
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
        {currentUserRole === 200 ?(
                  <Button onClick={downloadPdf} className="mt-4 p-2  text-white ">
          Download PDF
        </Button>
        ): (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default AllprojectsProjectList;
