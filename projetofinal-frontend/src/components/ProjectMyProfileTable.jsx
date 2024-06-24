import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import { TextInput } from "flowbite-react";
import { GoProjectRoadmap } from "react-icons/go";
import { Tooltip } from "react-tooltip";

// Helper function to convert the date array to a JS Date object
const formatDate = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) {
    return "";
  }
  const [year, month, day, hour = 0, minute = 0] = dateArray;
  return new Date(year, month - 1, day, hour, minute)
    .toISOString()
    .split("T")[0];
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

function ProjectMyProfileTable({
  data,
  onRowClick,
  loading,
  pagination,
  paginationServer,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
  rowsPerPage,
}) {
  const navigate = useNavigate();

  const columns = [
    {
      name: "Project Name",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div className="flex justify-between items-center w-full">
          <span>{row.title}</span>
          <div>
            <GoProjectRoadmap
              id={`tip-project-details-${row.id}`}
              className="ml-2 text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate(`/myProjects/${row.id}`)}
            />
            <Tooltip
              anchorSelect={`tip-project-details-${row.id}`}
              content="Project Details"
              place="top"
            />
          </div>
        </div>
      ),
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
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => onRowClick(row.id)}
          className="text-blue-500 hover:underline"
        >
          View Gantt Chart
        </button>
      ),
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
    <div className="p-6 border border-gray-600 bg-white rounded-lg">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl ml-3 font-bold">My Projects</h2>
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
        paginationDefaultRowsPerPage={10}
        paginationPerPage={rowsPerPage}
        fixedHeader
        striped
        responsive
      />
    </div>
  );
}

export default ProjectMyProfileTable;
