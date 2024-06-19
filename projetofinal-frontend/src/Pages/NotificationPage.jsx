import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import NotificationsTable from "../Components/NotificationsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { BsBellSlash } from "react-icons/bs";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { BsEnvelopePlus } from "react-icons/bs";
import { Tooltip } from "react-tooltip";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [type, setType] = useState("INFO"); // Toggle between notification types
  const [seen, setSeen] = useState(false); // State for seen filter

  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const headers = {
          Accept: "*/*",
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        let url = `${apiUrl}/notifications?type=${type}&seen=${seen}&page=${page}&limit=${rowsPerPage}`;

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNotifications(data.notifications);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [page, rowsPerPage, apiUrl, token, type, seen]);

  const updateSeenStatus = async (notificationId, newStatus) => {
    try {
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/notifications/seen`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ seen: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state with the new seen status
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, seen: newStatus }
            : notification
        )
      );
    } catch (error) {
      console.error("Error updating seen status:", error);
    }
  };

  const bulkUpdateSeenStatus = async (newStatus) => {
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
      ); // Get all notification IDs

      const response = await fetch(`${apiUrl}/notifications/seen`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ notificationIds, seen: newStatus }), // Send notification IDs and new status
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state with the new seen status for all notifications
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          seen: newStatus,
        }))
      );
    } catch (error) {
      console.error("Error updating seen status:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={2} activeSubProjects={3} />
      <div className="flex p-14">
        <div className="w-1/5">
          <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg border-2 border-red-900">
            <div className="flex flex-col space-y-1 flex-grow">
              {/* Type toggles */}
              <button
                onClick={() => setType("ALL")}
                className={`btn flex items-center rounded justify-center ${
                  type === "ALL"
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
                content="All Notifications"
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
                content="Project Notifications"
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
                content="Managing Notifications"
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
                content="Invitation Notifications"
                place="top"
                effect="solid"
              />
              <button
                onClick={() => setSeen(!seen)}
                className={`btn flex items-center rounded justify-center ${
                  seen ? "border border-cyan-500" : "border border-transparent"
                }`}
                data-tip
                data-for="notSeenTooltip"
                id="notSeenBtn"
              >
                <BsBellSlash size={30} />
              </button>
              <Tooltip
                anchorSelect="#notSeenBtn"
                content="Not Seen Notifications"
                place="top"
                effect="solid"
              />
            </div>
          </div>
        </div>
        <div className="w-3/4 h-full">
          <NotificationsTable
            data={notifications}
            pagination
            paginationServer
            paginationTotalRows={totalPages}
            onChangePage={(newPage) => setPage(newPage)}
            onChangeRowsPerPage={(newRowsPerPage) =>
              setRowsPerPage(newRowsPerPage)
            }
            rowsPerPage={rowsPerPage}
            page={page}
            totalPages={totalPages}
            onUpdateSeenStatus={updateSeenStatus}
            onBulkUpdateSeenStatus={bulkUpdateSeenStatus}
            authToken={token}
          />
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
