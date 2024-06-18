import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import MessagesTable from "../Components/MessagesTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import {
  BsEnvelopeArrowDown,
  BsEnvelopeArrowUp,
  BsFillEnvelopeExclamationFill,
  BsEnvelopePlus,
} from "react-icons/bs";
import { Tooltip } from "react-tooltip";

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState("received"); // Toggle between 'received', 'sent', and 'unread'
  const [usernameFilter, setUsernameFilter] = useState(""); // State for username search filter
  const [contentFilter, setContentFilter] = useState(""); // State for content search filter
  const [searchActive, setSearchActive] = useState(false); // State to track if search filter is active
  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const headers = {
          Accept: "*/*",
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        let url = `${apiUrl}/messages?type=${view}&page=${page}&limit=${rowsPerPage}`;

        if (searchActive && usernameFilter) {
          url += `&username=${encodeURIComponent(usernameFilter)}`;
        }

        if (searchActive && contentFilter) {
          url += `&content=${encodeURIComponent(contentFilter)}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessages(data.messages);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [
    page,
    rowsPerPage,
    apiUrl,
    token,
    view,
    usernameFilter,
    contentFilter,
    searchActive,
  ]);

  const updateSeenStatus = async (messageId, newStatus) => {
    try {
      const headers = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/messages/seen`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ seen: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state with the new seen status
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId ? { ...message, seen: newStatus } : message
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

      const messageIds = messages.map((message) => message.id); // Get all message IDs

      const response = await fetch(`${apiUrl}/messages/seen`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ messageIds, seen: newStatus }), // Send message IDs and new status
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state with the new seen status for all messages
      setMessages((prevMessages) =>
        prevMessages.map((message) => ({ ...message, seen: newStatus }))
      );
    } catch (error) {
      console.error("Error updating seen status:", error);
    }
  };

  const handleSearchSubmit = () => {
    setPage(1); // Reset page number to 1 when applying a new search
    setSearchActive(true);
  };

  const handleClearSearch = () => {
    setPage(1); // Reset page number to 1 when clearing search
    setSearchActive(false);
    setUsernameFilter("");
    setContentFilter("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={2} activeSubProjects={2} />
      <div className="flex p-14">
        <div className="w-1/5">
          <div className="flex flex-col h-full bg-white p-4 rounded-lg shadow-lg border-2 border-red-900">
            <div className="flex flex-col space-y-4 flex-grow">
              {/* View toggles */}
              <button
                onClick={() => setView("received")}
                className={`btn flex items-center rounded justify-center ${
                  view === "received"
                    ? "border border-cyan-500"
                    : "border border-transparent"
                }`}
                data-tip
                data-for="receivedTooltip"
                id="receivedBtn"
              >
                <BsEnvelopeArrowDown size={25} />
              </button>
              <Tooltip
                anchorSelect="#receivedBtn"
                content="Received Messages"
                place="top"
                effect="solid"
              />

              <button
                onClick={() => setView("sent")}
                className={`btn flex items-center rounded justify-center ${
                  view === "sent"
                    ? "border border-cyan-500"
                    : "border border-transparent"
                }`}
                data-tip
                data-for="sentTooltip"
                id="sentBtn"
              >
                <BsEnvelopeArrowUp size={25} />
              </button>
              <Tooltip
                anchorSelect="#sentBtn"
                content="Sent Messages"
                place="top"
                effect="solid"
              />

              <button
                onClick={() => setView("unread")}
                className={`btn flex items-center rounded justify-center ${
                  view === "unread"
                    ? "border border-cyan-500"
                    : "border border-transparent"
                }`}
                data-tip
                data-for="unreadTooltip"
                id="unreadBtn"
              >
                <BsFillEnvelopeExclamationFill size={25} />
              </button>
              <Tooltip
                anchorSelect="#unreadBtn"
                content="Unread Messages"
                place="top"
                effect="solid"
              />
            </div>

            {/* Username and content search filter */}
            <div className="mt-auto">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={
                    searchActive ? handleClearSearch : handleSearchSubmit
                  }
                  className={`btn w-full ${
                    searchActive
                      ? "bg-gray-300 hover:bg-gray-400"
                      : "bg-cyan-500 text-white hover:bg-cyan-700"
                  } px-4 py-1 rounded`}
                >
                  {searchActive ? "Clear" : "Search"}
                </button>
                <input
                  type="text"
                  placeholder="Search by username"
                  className="px-2 py-1 border border-cyan-500 rounded"
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Search by content"
                  className="px-2 py-1 border border-cyan-500 rounded"
                  value={contentFilter}
                  onChange={(e) => setContentFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/4 h-full">
          <MessagesTable
            data={messages}
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
            view={view}
            onBulkUpdateSeenStatus={bulkUpdateSeenStatus}
            authToken={token}
          />
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
