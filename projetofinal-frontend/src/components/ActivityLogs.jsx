import React from "react";
import { Button, ToggleSwitch, TextInput } from "flowbite-react";
import CreateLogModal from "./CreateLogModal";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function ActivityLogs({ tasks, projectId, logs }) {
  // Estado para controlar a visibilidade do modal
  const [showModal, setShowModal] = useState(false);
  // Estado para armazenar e manipular os logs
  const [totalLogs, setTotalLogs] = useState(logs);
  // Estado para controlar a expansão dos logs
  const [expandedLogs, setExpandedLogs] = useState({});
  // Estados para controlar os filtros
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  // Estados para controlar os valores de busca na pesquisa
  const [taskSearch, setTaskSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  // Estado para controlar a visibilidade da legenda
  const [showLegend, setShowLegend] = useState(false);
  const { t } = useTranslation(); // Função de tradução

  // Função para filtrar logs com base nos switches e nos campos de busca
  const handleFilter = (log) => {
    if (
      switch1 &&
      taskSearch &&
      (!log.taskName ||
        !log.taskName.toLowerCase().includes(taskSearch.toLowerCase()))
    ) {
      return false;
    }
    if (
      switch2 &&
      userSearch &&
      (!log.userName ||
        !log.userName.toLowerCase().includes(userSearch.toLowerCase()))
    ) {
      return false;
    }
    return true;
  };

  // Funções para abrir e fechar o modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Objeto para mapear códigos de status de logs a classes de cores do Tailwind CSS
  const logColors = {
    100: "bg-blue-300",
    200: "bg-yellow-300",
    300: "bg-red-400",
    400: "bg-orange-400",
    500: "bg-gray-400",
  };

  // Função para formatar a data de um log para o formato de input de data
  const formatDateForInput = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    const dateFinal = date.toLocaleDateString("pt-BR");
    return dateFinal;
  };

  // Função para formatar a hora de um log para o formato de input de hora
  const formatTimeForInput = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 5) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    //Container principal
    <div className="flex flex-col items-center p-4 space-y-4 rounded-md bg-white">
      {/*Container para o título e a legenda*/}
      <div className="flex flex-row items-center">
        {/* Título */}
        <h1 className="text-4xl font-bold underline mb-4">
          {t("Activity Log")}
        </h1>
        <div
          className="relative top-0 right-0 cursor-pointer ml-2 mb-2"
          onMouseEnter={() => setShowLegend(true)}
          onMouseLeave={() => setShowLegend(false)}
        >
          {/* Ícone de informação que mostra e esconde as cores e legendas de cada cor */}
          <FaInfoCircle size={30} />
          {showLegend && (
            <div className="absolute top-full right-0 bg-white p-4 rounded-md shadow-lg z-10 w-64">
              <p>
                <span className="inline-block w-4 h-4 bg-blue-300 mr-2"></span>
                {t("Tasks")}
              </p>
              <p>
                <span className="inline-block w-4 h-4 bg-yellow-300 mr-2"></span>
                {t("Additions")}
              </p>
              <p>
                <span className="inline-block w-4 h-4 bg-red-400 mr-2"></span>
                {t("Removals")}
              </p>
              <p>
                <span className="inline-block w-4 h-4 bg-orange-400 mr-2"></span>
                {t("Project State")}
              </p>
              <p>
                <span className="inline-block w-4 h-4 bg-gray-400 mr-2"></span>
                {t("Personal logs")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/*Container para os filtros: por task e por user*/}
      <div className="flex max-w-md flex-col gap-4">
        <div className="flex items-center gap-4">
          <ToggleSwitch
            checked={switch1}
            label={t("Filter by task")}
            onChange={setSwitch1}
          />
          {switch1 && (
            // Campo de texto para inserir o filtro por tarefa, visível apenas se o switch estiver ativo
            <TextInput
              placeholder={t("Search by task")}
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <ToggleSwitch
            checked={switch2}
            label={t("Filter by user")}
            onChange={setSwitch2}
          />
          {switch2 && (
            // Campo de texto para inserir o filtro por usuário, visível apenas se o switch estiver ativo
            <TextInput
              placeholder={t("Search by user")}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          )}
        </div>
      </div>

      {/*Container para os logs*/}
      <div className="overflow-auto space-y-4 h-[30rem]">
        {totalLogs.filter(handleFilter).map((log) => {
          // Mapeia cada log filtrado para exibição
          const formattedDate = formatDateForInput(log.timestamp); // Formata a data do log
          const formattedTime = formatTimeForInput(log.timestamp); // Formata a hora do log

          const shortDescription = log.newDescription // Gera uma descrição curta se tiver mais do que 15 caracteres
            ? log.newDescription.length > 15
              ? log.newDescription.slice(0, 15) + " (...)"
              : log.newDescription
            : "";
          const displayText = log.title ? log.title : shortDescription; // Decide o texto a ser exibido consoante a existência de um título ou não

          return (
            <div
              key={log.id}
              className={`w-72 rounded-md border border-black ${
                logColors[log.type]
              } ${expandedLogs[log.id] ? "h-auto" : "h-24"}`}
              onMouseEnter={() =>
                !log.title &&
                setExpandedLogs((prev) => ({ ...prev, [log.id]: true }))
              }
              onMouseLeave={() =>
                !log.title &&
                setExpandedLogs((prev) => ({ ...prev, [log.id]: false }))
              }
            >
              <p className="text-center font-bold">{displayText}</p>
              {expandedLogs[log.id] && (
                // Conteúdo expandido com descrição completa e nome da tarefa, se disponível

                <>
                  <p className="text-center">{log.newDescription}</p>
                  {log.taskName && (
                    <p className="text-center font-bold">
                      {" "}
                      {t("About")} {log.taskName}
                    </p>
                  )}
                </>
              )}
              <p className="text-center">{formattedDate}</p>{" "}
              {/* Exibe a data formatada */}
              <p className="text-center">{formattedTime}</p>{" "}
              {/* Exibe a hora formatada */}
              <p className="text-center font-bold">{log.userName}</p>{" "}
              {/* Exibe o nome do usuário */}
            </div>
          );
        })}
      </div>
      <Button onClick={handleOpenModal} className="mb-3">
        {t("Create log")}
      </Button>
      {showModal && (
        // Modal para criar um novo log
        <CreateLogModal
          tasks={tasks}
          onClose={handleCloseModal}
          projectId={projectId}
          addNewLog={setTotalLogs}
        />
      )}
    </div>
  );
}

export default ActivityLogs;
// Exporta o componente ActivityLogs como padrão
