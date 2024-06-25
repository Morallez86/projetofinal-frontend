import React from "react";
import DataTable from "react-data-table-component";
import { TextInput } from "flowbite-react";
import { useState } from "react";
import ComponentResourceCardDetails from "./ComponentResourceCardDetails";

function ComponentsTable({
  data,
  loading,
  pagination,
  paginationServer,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
  rowsPerPage,
  setFilterText,
  context,
}) {
  console.log(data);
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Supplier",
      selector: (row) => row.supplier,
      sortable: true,
    },
    {
      name: "Identifier",
      selector: (row) => row.identifier,
      sortable: true,
    },
  ];

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setFilterText(searchKeyword);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg h-[44rem] shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {" "}
          {context === "components"
            ? "Components"
            : context === "resources"
            ? "Resources"
            : ""}
        </h2>
        <TextInput
          placeholder="Search by name, brand, supplier or identifier..."
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchKeyword(e.target.value)}
          value={searchKeyword}
          className="w-1/4"
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
        paginationPerPage={rowsPerPage}
        responsive
        onRowClicked={(row) => {
          setSelectedRow(row);
          setIsModalOpen(true);
        }}
        customStyles={{
          rows: {
            style: {
              cursor: "pointer",
            },
          },
        }}
      />
      {isModalOpen && (
        <ComponentResourceCardDetails
          data={selectedRow}
          context={context}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ComponentsTable;
