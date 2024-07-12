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
  const apiUrl = useApiStore.getState().apiUrl; // apiUrl
  const token = useUserStore((state) => state.token); // token
  const [projects, setProjects] = useState([]); // projetos
  const [loading, setLoading] = useState(true); // loading
  const [totalPages, setTotalPages] = useState(0); // total de páginas
  useSkills(); // skills
  useInterests(); // interesses
  const setProjectTimestamp = useUserStore( // timestamp do projeto
    (state) => state.setProjectTimestamp
  ); 
  const projectTimestamps = useUserStore((state) => state.projectTimestamps); // timestamps dos projetos

  const handleSessionTimeout = () => { // função para timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // navegar para a página inicial
  };

  useEffect(() => { // useEffect para atualizar o timestamp do projeto
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // decodificar o token
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
  }, [token, setProjectTimestamp]); // dependências

  

  useEffect(() => { // useEffect para buscar os projetos
    if (!userId) return;

    const fetchProjects = async () => { 
      setLoading(true); // loading
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

        if (response.status === 401) { // status 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") { // token inválido
            handleSessionTimeout(); // timeout da sessão
            return; 
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        }

        if (!response.ok) { // se a resposta não for ok
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
  }, [page, rowsPerPage, apiUrl, token, userId]); // dependências

  return { projects, loading, totalPages }; 
};

function MyProfileMyProjects() { // função para os projetos do utilizador
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token); // token
  const decodedToken = token ? jwtDecode(token) : null; // token decodificado
  const userId = decodedToken ? decodedToken.id : null; // id do utilizador
  const [page, setPage] = useState(0); // página
  const [rowsPerPage, setRowsPerPage] = useState(10); // linhas por página
  const { projects, loading, totalPages } = useProjects( // projetos
    userId,
    page,
    rowsPerPage
  );
  const [viewMode, setViewMode] = useState('table'); 

  const handleRowClick = (projectId) => { // função para clicar numa linha
    navigate(`/myProjects/${projectId}/ganttChart`); // navegar para a página do projeto
  };

  return (
    <div className="flex flex-col min-h-screen">
    <div className="p-4 sm:p-8 md:p-14">
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
