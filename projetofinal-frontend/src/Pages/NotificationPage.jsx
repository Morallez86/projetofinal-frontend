import React, { useEffect, useState, useCallback } from "react";
import NotificationsTable from "../Components/NotificationsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { BsEnvelopePlus } from "react-icons/bs";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useWebSocket } from "../WebSocketContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]); // notificações
  const [page, setPage] = useState(1); // página
  const [rowsPerPage, setRowsPerPage] = useState(10); // linhas por página
  const [totalPages, setTotalPages] = useState(0); // total de páginas
  const [type, setType] = useState(null); // tipo
  const [seen, setSeen] = useState(false); // visto
  const { registerMessageHandler, unregisterMessageHandler } = useWebSocket(); // webSocket
  const { token } = useUserStore(); // token

  const apiUrl = useApiStore.getState().apiUrl; // apiUrl
  const { t } = useTranslation(); // tradução

 
  const fetchNotifications = useCallback(async () => { // função para buscar as notificações
    try {
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      
      let url = `${apiUrl}/notifications?seen=${seen}&page=${page}&limit=${rowsPerPage}`; // url
      if (type !== null) {
        url += `&type=${type}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) { // se a resposta não for ok
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      
      if (response.status === 401) { // status 401
        const errorMessage = data.message || "Unauthorized";

        
        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // timeout da sessão
        } else {
          console.error("Error fetching notifications:", errorMessage);
        }
        return; 
      }

      
      setNotifications(data.notifications);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [apiUrl, token, seen, page, rowsPerPage, type]); // dependências

  useEffect(() => { // useEffect para buscar as notificações
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => { // useEffect para buscar as notificações
    const handleNotification = (message) => {
      if (message.type === "notification") {
        
        fetchNotifications(); 
      }
    };

    registerMessageHandler(handleNotification); // registrar mensagem

    return () => {
      unregisterMessageHandler(handleNotification);
    };
  }, [fetchNotifications, registerMessageHandler, unregisterMessageHandler]); // dependências

  const updateSeenStatus = async (notificationId, newStatus) => { // função para atualizar o status visto
    try {
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/notifications/seen`, { // fetch para atualizar o status visto
        method: "PUT",
        headers,
        body: JSON.stringify({
          messageOrNotificationIds: [notificationId],
          seen: newStatus,
        }),
      });

      
      if (response.status === 401) { // status 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }

      if (!response.ok) { // se a resposta não for ok
        throw new Error(`HTTP error! status: ${response.status}`);
      }

     
      await fetchNotifications(); // buscar as notificações
    } catch (error) {
      console.error("Error updating seen status:", error);
    }
  };

  const bulkUpdateSeenStatus = async (newStatus) => { // função para atualizar o status visto em massa
    try {
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const notificationIds = notifications.map(
        (notification) => notification.id
      ); // notificações

      const response = await fetch(`${apiUrl}/notifications/seen`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          messageOrNotificationIds: notificationIds,
          seen: newStatus,
        }), // atualizar o status visto
      });

      
      if (response.status === 401) { // status 401
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchNotifications(); // obter as notificações
    } catch (error) {
      console.error("Error updating seen status:", error);
    }
  };

  const handleSessionTimeout = () => { // timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  return (
    <div className="flex flex-col min-h-screen">
    <div className="flex flex-col md:flex-row p-4 md:p-14">
      <div className="md:w-1/6 w-full">
        <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg border-2 border-red-900">
          <div className="flex flex-col space-y-2 flex-grow">
              {/* Type toggles */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-center"> {t("Notifications")} </h2>
                <div className="text-right">
                  <button
                    onClick={() => setSeen(!seen)}
                    className={`btn flex items-center rounded justify-center ${
                      seen
                        ? "border border-cyan-500"
                        : "border border-transparent"
                    }`}
                    data-tip
                    data-for="seenTooltip"
                    id="seenBtn"
                  >
                    {seen ? (
                      <FaRegEye size={20} />
                    ) : (
                      <FaRegEyeSlash size={20} />
                    )}
                  </button>
                  <Tooltip
                    anchorSelect="#seenBtn"
                    content={seen ? t("Seen") : t("Unseen")}
                    place="top"
                    effect="solid"
                  />
                </div>
              </div>
              <button
                onClick={() => setType(null)}
                className={`btn flex items-center rounded justify-center ${
                  type === null 
                    ? "border border-cyan-500"
                    : "border border-transparent"
                }`}
                data-tip
                data-for="allTooltip"
                id="allBtn"
              >
                <IoIosNotificationsOutline size={35} />
              </button>
              <Tooltip
                anchorSelect="#allBtn"
                content={t("All")}
                place="top"
                effect="solid"
              />

              <button
                onClick={() => setType("PROJECT")}
                className={`btn flex items-center rounded justify-center ${
                  type === "PROJECT"
                    ? "border border-cyan-500"
                    : "border border-transparent"
                }`}
                data-tip
                data-for="projectTooltip"
                id="projectBtn"
              >
                <AiOutlineFundProjectionScreen size={30} />
              </button>
              <Tooltip
                anchorSelect="#projectBtn"
                content={t("Project")}
                place="top"
                effect="solid"
              />

              <button
                onClick={() => setType("MANAGING")}
                className={`btn flex items-center rounded justify-center ${
                  type === "MANAGING"
                    ? "border border-cyan-500"
                    : "border border-transparent"
                }`}
                data-tip
                data-for="managingTooltip"
                id="managingBtn"
              >
                <MdOutlineManageAccounts size={35} />
              </button>
              <Tooltip
                anchorSelect="#managingBtn"
                content={t("Managing")}
                place="top"
                effect="solid"
              />

              <button
                onClick={() => setType("INVITATION")}
                className={`btn flex items-center rounded justify-center ${
                  type === "INVITATION"
                    ? "border border-cyan-500"
                    : "border border-transparent"
                }`}
                data-tip
                data-for="invitationTooltip"
                id="invitationBtn"
              >
                <BsEnvelopePlus size={30} />
              </button>
              <Tooltip
                anchorSelect="#invitationBtn"
                content={t("Invitation")}
                place="top"
                effect="solid"
              />
            </div>
          </div>
        </div>
        <div className="flex-grow mt-4 md:mt-0">
        <NotificationsTable
            data={notifications}
            pagination
            paginationServer
            paginationTotalRows={totalPages * rowsPerPage}
            onChangePage={(newPage) => setPage(newPage)}
            onChangeRowsPerPage={(newRowsPerPage) =>
              setRowsPerPage(newRowsPerPage)
            }
            rowsPerPage={rowsPerPage}
            onUpdateSeenStatus={updateSeenStatus}
            onBulkUpdateSeenStatus={bulkUpdateSeenStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
