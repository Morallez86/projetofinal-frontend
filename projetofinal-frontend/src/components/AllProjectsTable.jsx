import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { TextInput } from "flowbite-react";

// Helper function to convert the date array to a JS Date object
const formatDate = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) {
    return "Invalid Date";
  }
  // Adjust month value as JS Date months are zero-based
  const [year, month, day, hour = 0, minute = 0] = dateArray;
  return new Date(year, month - 1, day, hour, minute).toLocaleDateString();
};

// Helper function to map status value to status string
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
  const columns = [
    {
      name: "Project Name",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => getStatusString(row.status),
      sortable: true,
    },
    {
      name: "Approved",
      selector: (row) => (row.approved ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Creation Date",
      selector: (row) => formatDate(row.creationDate),
      sortable: true,
    },
    {
      name: "Planned End Date",
      selector: (row) => formatDate(row.plannedEndDate),
      sortable: true,
    },
  ];

  const [filterText, setFilterText] = useState("");

  const filteredItems = data.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">All Projects</h2>
        <TextInput
          placeholder="Search by name..."
          onChange={handleFilter}
          value={filterText}
          className="w-1/4"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredItems}
        progressPending={loading}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
        paginationPerPage={rowsPerPage}
        responsive
      />
    </div>
  );
}

export default AllProjectsTable;
