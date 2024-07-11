import React from "react";
import DataTable from "react-data-table-component";
import { FcInvite } from "react-icons/fc";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Tooltip } from 'flowbite-react';


// funçao que ajuda a formatar a data
const formatDate = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) {
    return "Invalid Date";
  }
  
  const [year, month, day, hour = 0, minute = 0] = dateArray; 
  return new Date(year, month - 1, day, hour, minute).toLocaleDateString();
};

// funçao que ajuda a obter o status como string
const getStatusString = (statusValue) => {
  switch (statusValue) {
    case 100:
      return "PLANNING";
    case 200:
      return "READY";
    case 300:
      return "IN PROGRESS";
    case 400:
      return "FINISHED";
    case 500:
      return "CANCELLED";
    default:
      return "UNKNOWN";
  }
};

// funçao que ajuda a obter as skills como string separada por virgulas
const getSkillsString = (skills) => {
  if (!Array.isArray(skills)) {
    return "No skills";
  }
  return skills.map((skill) => skill.name).join(", ");
};

// funçao que ajuda a obter os interesses como string separada por virgulas
const getInterestsString = (interests) => {
  if (!Array.isArray(interests)) {
    return "No interests";
  }
  return interests.map((interest) => interest.name).join(", ");
};

function AllProjectsTable({
  data,
  loading,
  pagination,
  paginationServer,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
  rowsPerPage,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter o URL da API
  const token = useUserStore((state) => state.token); // Obter o token do utilizador
  const navigate = useNavigate();
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Redirecionar para a página inicial
  };

  const { t } = useTranslation();

  const handleInviteClick = async (projectId) => { // Função para enviar um convite para um projeto
    const confirmed = window.confirm( // Confirmar a ação
      t("AreYouSureYouWantToSendAnInvitationToThisProject") 
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/notifications`, { // Enviar o convite
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "300",
          projectId: projectId,
        }),
      });

      if (response.ok) { // Se a resposta for bem-sucedida
        alert("Invitation sent successfully");
      } else if (response.status === 401) { // Se a resposta for 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Lidar com o timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        alert("Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("An error occurred while sending the invitation");
    }
  };

  const columns = [ // Colunas da tabela
    {
      name: t("ProjectName"),
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: t("Status"),
      selector: (row) => getStatusString(row.status),
      sortable: true,
    },
    {
      name: t("Skills"),
      selector: (row) => getSkillsString(row.skills),
      sortable: true,
      cell: (row) => (
        <Tooltip content={getSkillsString(row.skills)}>
          <span>{getSkillsString(row.skills)}</span>
        </Tooltip>
      ),
    },
    {
      name: t("Interests"),
      selector: (row) => getInterestsString(row.interests),
      sortable: true,
      cell: (row) => (
        <Tooltip content={getInterestsString(row.interests)}>
          <span>{getInterestsString(row.interests)}</span>
        </Tooltip>
      ),
    },
    {
      name: t("SlotsOpen"),
      selector: (row) => row.maxUsers - row.userProjectDtos.length,
      cell: (row) => {
        // Calcula slotsOpen para este projeto específico
        const activeUsersCount = row.userProjectDtos.filter(
          (projectUser) => projectUser.status === "active"
        ).length;
        const slotsOpen = row.maxUsers - activeUsersCount - 1;
        return (
          <div className="flex justify-between items-center w-1/2">
            <span>{slotsOpen}</span>
            <FcInvite
              className={`ml-2 cursor-pointer ${
                slotsOpen <= 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={slotsOpen > 0 ? () => handleInviteClick(row.id) : null}
            />
          </div>
        );
      },
    },
    {
      name: t("CreationDate"),
      selector: (row) => formatDate(row.creationDate),
      sortable: true,
    },
  ];

  const ProjectCard = ({ project }) => {
    // Calcula slotsOpen para este projeto específico
    const activeUsersCount = project.userProjectDtos.filter(
      (projectUser) => projectUser.status === "active"
    ).length;
    const slotsOpen = project.maxUsers - activeUsersCount - 1;
  
    return (
      <div className="p-4 m-2 border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">{project.title}</h2>
        <p>{getStatusString(project.status)}</p>
        <p> Skills: {getSkillsString(project.skills)}</p>
        <p>Interests: {getInterestsString(project.interests)}</p>
        <p>Slots Open: {slotsOpen}</p>
        <p>Creation Date: {formatDate(project.creationDate)}</p>
        <button
          className={`mt-4 px-4 py-2 rounded ${
            slotsOpen > 0 ? "bg-blue-500 hover:bg-blue-700 text-white" : "bg-gray-500 text-gray-200"
          }`}
          onClick={slotsOpen > 0 ? () => handleInviteClick(project.id) : null}
          disabled={slotsOpen <= 0}
        >
          Participate
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 border border-gray-600 bg-white rounded-lg">
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-center ml-3">All Projects</h1>
    </div>
    {/* Tabela visível apenas em telas grandes */}
    <div className="hidden lg:block">
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
        paginationPerPage={rowsPerPage}
        responsive
        paginationComponentOptions={{
          rowsPerPageText: t("RowsPerPage"),
          rangeSeparatorText: t("of"),
        }}
      />
    </div>
    {/* Cards visíveis apenas em telas pequenas */}
    <div className="lg:hidden">
      {data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  </div>
  );
}

export default AllProjectsTable;
