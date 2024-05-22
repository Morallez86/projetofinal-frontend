import React from "react";
import DataTable from "react-data-table-component";

function ProjectMyProfileTable() {
  const columns = [
    {
      name: "Project Name",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.creation_date,
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      selector: (row) => row.status,
      sortable: true,
    },
  ];

  return (
    <div>
      <DataTable
        title="My Projects"
        columns={columns}
        data={[]}
        fixedHeader
        pagination
        responsive
      />
    </div>
  );
}

export default ProjectMyProfileTable;
