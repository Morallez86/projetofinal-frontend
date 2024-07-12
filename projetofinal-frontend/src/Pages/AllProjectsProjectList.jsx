import React, { useEffect, useState, useCallback } from "react";
import AllProjectsTable from "../Components/AllProjectsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { TextInput, Button, Select } from "flowbite-react";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function AllprojectsProjectList() {
  const [projects, setProjects] = useState([]); // Projetos
  const [loading, setLoading] = useState(true); // Loading
  const [page, setPage] = useState(1); // Página
  const [rowsPerPage, setRowsPerPage] = useState(10); // Linhas por página
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [skills, setSkills] = useState("");  // Skills
  const [interests, setInterests] = useState(""); // Interesses
  const [status, setStatus] = useState(""); // Estado
  const apiUrl = useApiStore.getState().apiUrl; // URL da API
  const token = useUserStore((state) => state.token); // Token
  const navigate = useNavigate();
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Navegar para a página inicial
  };

  const { t } = useTranslation(); // Função de tradução

  let currentUserRole;
  if (token) {
    const decodedToken = jwtDecode(token); // Decodificar o token
    currentUserRole = decodedToken.role; // Obter o papel do utilizador
  }

  const fetchProjects = useCallback( // Função para obter os projetos
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

        if (response.status === 401) { // Se o status for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Timeout da sessão
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data.projects); // Definir os projetos
        setTotalPages(data.totalPages); // Definir o total de páginas
       
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, page, rowsPerPage, token] // Dependências
  );

  useEffect(() => { // Efeito para obter os projetos
    fetchProjects(searchTerm, skills, interests, status);
  }, [fetchProjects, page, rowsPerPage]); // Dependências

  const handleSearch = () => { // Função para pesquisar
    setPage(1); // Definir a página para 1
    fetchProjects(searchTerm, skills, interests, status);
  };

  const downloadPdf = async () => { // Função para fazer o download do PDF
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

      if (response.status === 401) { // Se o status for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }

      if (!response.ok) { // Se não for ok
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
    <div className="p-4 sm:p-14">
      <div className="flex flex-wrap items-center mb-4 space-x-2">
        <TextInput
          placeholder={t("SearchByProjectName")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-auto mb-2 sm:mb-0 sm:w-1/5"
        />
        <TextInput
          placeholder={t("SearchBySkills")}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="flex-auto mb-2 sm:mb-0 sm:w-1/5"
        />
        <TextInput
          placeholder={t("SearchByInterests")}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="flex-auto mb-2 sm:mb-0 sm:w-1/5"
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex-auto mb-2 mt-1 sm:mb-0 sm:w-1/5"
        >
          <option value="">{t("AllStatuses")}</option>
          <option value="100">{t("Planning")}</option>
          <option value="200">{t("Ready")}</option>
          <option value="300">{t("InProgress")}</option>
          <option value="400">{t("Finished")}</option>
          <option value="500">{t("Cancelled")}</option>
        </Select>
        <Button onClick={handleSearch} className="w-full sm:w-auto sm:ml-2">
          {t("Search")}
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
        {currentUserRole === 200 ? (
          <Button onClick={downloadPdf} className="mt-4 p-2  text-white ">
            {t("DownloadPDF")}
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default AllprojectsProjectList;
