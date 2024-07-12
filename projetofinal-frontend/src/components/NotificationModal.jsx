import React, { useState, useEffect } from "react";
import { TiTick, TiTimes } from "react-icons/ti";
import { Button, Label } from "flowbite-react";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const NotificationModal = ({ isOpen, closeModal, notification }) => {
  const apiUrl = useApiStore.getState().apiUrl; // URL da API
  const token = useUserStore((state) => state.token); // Token do utilizador
  const [successMessage, setSuccessMessage] = useState(false); // Mensagem de sucesso
  const [currentUserId, setCurrentUserId] = useState(null); // ID do utilizador atual
  const { t } = useTranslation(); // Função de tradução
  const navigate = useNavigate();
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Navegar para a página inicial
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token); // Decodificar o token
      setCurrentUserId(decodedToken.id); // ID do utilizador atual
      
    }
  }, [token]);

  if (!notification) { 
    return null;
  }

  const formatDateForInput = (dateArray) => { // Função para formatar a data
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleDateString("pt-BR");
  };

  const formatTimeForInput = (dateArray) => { // Função para formatar o horário
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

  const formattedDate = formatDateForInput(notification.timestamp);
  const formattedTime = formatTimeForInput(notification.timestamp);

  const handleApprove = async () => { // Função para aprovar
    try {
      const body = {
        id: notification.id,
        projectId: notification.projectId,
        senderId: currentUserId,
        receiverId: notification.receiverId,
        approval: true,
      };

      
      if (notification.type === "INVITATION") { // Se a notificação for de convite
        body.type = "400";
        
      } else if ( // Se a notificação for de gestão
        notification.type === "MANAGING" &&
        notification.action === "INVITATION"
      ) {
        body.type = "300";
      }
      

      const response = await fetch(`${apiUrl}/notifications/approval`, {  // Aprovar a notificação
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) { // Verificar se a resposta é bem-sucedida
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
          closeModal();
        }, 3000);
      } else if (response.status === 401) { // Verificar se o token é inválido
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Lidar com o timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Failed to approve notification");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
 
  const handleReject = async () => { // Função para rejeitar
    try {
      const body = {
        id: notification.id,
        projectId: notification.projectId,
        senderId: currentUserId,
        receiverId: notification.receiverId,
        approval: false,
      };

      if (notification.type === "INVITATION") { // Se a notificação for de convite
        body.type = "400";
      } else if (notification.type === "MANAGING") { // Se a notificação for de gestão
        body.type = "300";
      }

      const response = await fetch(`${apiUrl}/notifications/approval`, { 
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) { // Verificar se a resposta é bem-sucedida
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
          closeModal();
        }, 3000);
      } else if (response.status === 401) { // Verificar se o token é inválido
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Lidar com o timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Failed to reject notification");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "flex items-center justify-center" : "hidden"
      }`}
      onClick={closeModal}
    >
      <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
      <div
        className="modal-content bg-white opacity-95 border border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-gray-400  w-full max-w-md p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4"> {t("NotificationDetails")}</h2>
        <div className="mb-2">
          <strong> {t("Description")}:</strong> {notification.description}
        </div>
        <div className="mb-2">
          <strong> {t("Timestamp")}:</strong> {formattedDate} {formattedTime}
        </div>
        <div className="mb-2">
          <strong>{t("Type")}:</strong> {notification.type}
        </div>
        <div className="mb-2">
          <strong>{t("Seen")}:</strong> {notification.seen ? t("Yes") : t("No")}
        </div>
        {successMessage && (
          <div className="mb-2 ml-4 flex items-center col-span-full">
            <Label
              htmlFor="success"
              value={t("A notification was sent")}
              className="mb-2 text-green-700"
            />
          </div>
        )}
        {((notification.type === "MANAGING" &&
          notification.action === "INVITATION") ||
          (notification.type === "MANAGING" &&
            notification.action === "PROJECT") ||
          notification.type === "INVITATION") &&
          !notification.seen && (
            <div className="flex mt-4">
              <div className="flex-grow flex space-x-2">
                <Button color="success" onClick={handleApprove}>
                  <TiTick size={20} />
                </Button>
                <Button color="failure" onClick={handleReject}>
                  <TiTimes size={20} />
                </Button>
              </div>
            </div>
          )}
        <div className="mt-4 ml-auto">
          <button
            onClick={closeModal}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-400"
          >
            {t("Close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
