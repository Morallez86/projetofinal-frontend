import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import MessagesTable from "../Components/MessagesTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import "../general.css";

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState("received"); // Toggle between 'received' and 'sent'
  const apiUrl = useApiStore.getState().apiUrl;
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const headers = {
          Accept: "*/*",
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${apiUrl}/messages?type=${view}&page=${page}&limit=${rowsPerPage}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMessages(data.messages);
        setTotalPages(data.totalPages);
        console.log(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [page, rowsPerPage, apiUrl, token, view]);

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

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={2} activeSubProjects={2} />
      <div className="p-14">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setView("received")}
            className={`btn ${view === "received" ? "btn-active" : ""}`}
          >
            Received Messages
          </button>
          <button
            onClick={() => setView("sent")}
            className={`btn ${view === "sent" ? "btn-active" : ""}`}
          >
            Sent Messages
          </button>
        </div>
        <MessagesTable
          data={messages}
          loading={loading}
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
        />
      </div>
    </div>
  );
}

export default MessagesPage;
