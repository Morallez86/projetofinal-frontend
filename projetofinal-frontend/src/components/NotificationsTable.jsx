import React, { useState } from "react";
import DataTable from "react-data-table-component";
import NotificationModal from "./NotificationModal";

const NotificationsTable = ({
  data,
  pagination,
  paginationServer,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
  rowsPerPage,
  onUpdateSeenStatus,
  onBulkUpdateSeenStatus,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const openModal = (notification) => {
    setSelectedNotification(notification);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedNotification(null);
  };

  const formatDateForInput = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleDateString("pt-BR");
  };

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

  const handleSeenChange = async (notificationId, currentStatus) => {
    const newStatus = !currentStatus;
    await onUpdateSeenStatus(notificationId, newStatus);
  };

  const handleBulkSeenChange = async (event) => {
    const newStatus = event.target.checked;
    await onBulkUpdateSeenStatus(newStatus);
  };

  const columns = [
    { name: "Description", selector: (row) => row.description, sortable: true },
    {
      name: "Timestamp",
      selector: (row) => {
        const dateArray = row.timestamp;
        const formattedDate = formatDateForInput(dateArray);
        const formattedTime = formatTimeForInput(dateArray);
        return `${formattedDate} ${formattedTime}`;
      },
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: (
        <div>
          <input
            type="checkbox"
            onChange={handleBulkSeenChange}
            className="mr-2"
          />
          Seen
        </div>
      ),
      selector: (row) => (
        <input
          type="checkbox"
          checked={row.seen}
          onChange={() => handleSeenChange(row.id, row.seen)}
        />
      ),
      sortable: true,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg h-[44rem] shadow-lg border-2 border-red-900">
      <style>
        {`
          .clickable-rows {
            cursor: pointer;
          }
          .data-table-row {
            transition: background-color 0.2s ease;
          }
          .data-table-row:hover {
            background-color: #f0f4f8; /* Adjust as needed */
          }
        `}
      </style>
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationPerPage={rowsPerPage}
        onRowClicked={(row) => openModal(row)}
        noHeader={true}
        className="clickable-rows"
        customStyles={{
          rows: {
            style: {
              minHeight: "40px",
            },
          },
        }}
        striped={true}
      />
      <NotificationModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        notification={selectedNotification}
      />
    </div>
  );
};

export default NotificationsTable;
