import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import NotificationsTable from "../Components/NotificationsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { BsEnvelopePlus } from "react-icons/bs";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [type, setType] = useState(null); // Initialize with null
  const [seen, setSeen] = useState(false); // State for seen filter

  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);

  // Fetch notifications function
  const fetchNotifications = async () => {
    try {
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Construct the URL with conditional query parameters
      let url = `${apiUrl}/notifications?seen=${seen}&page=${page}&limit=${rowsPerPage}`;
      if (type !== null) {
        url += `&type=${type}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setNotifications(data.notifications);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
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
        body: JSON.stringify({
          messageOrNotificationIds: [notificationId],
          seen: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Fetch the latest notifications after updating the seen status
      await fetchNotifications();
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
        body: JSON.stringify({
          messageOrNotificationIds: notificationIds,
          seen: newStatus,
        }), // Send notification IDs and new status
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Fetch the latest notifications after updating the seen status
      await fetchNotifications();
    } catch (error) {
      console.error("Error updating seen status:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={2} activeSubProjects={3} />
      <div className="flex p-14">
        <div className="w-1/6">
          <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg border-2 border-red-900">
            <div className="flex flex-col space-y-2 flex-grow">
              {/* Type toggles */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-center">Notifications</h2>
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
                    content={seen ? "Seen" : "Not Seen"}
                    place="top"
                    effect="solid"
                  />
                </div>
              </div>
              <button
                onClick={() => setType(null)}
                className={`btn flex items-center rounded justify-center ${
                  type === null // Check for null instead of "ALL"
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
                content="All"
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
                content="Projects"
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
                content="Managing"
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
                content="Invitations"
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
