import React from "react";
import DataTable from "react-data-table-component";
import { TextInput } from "flowbite-react";
import { useState } from "react";
import ComponentResourceCardDetails from "./ComponentResourceCardDetails";
import { useTranslation } from "react-i18next";

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
  getComponents,
  getResources,
}) {
  console.log(data);
  const { t } = useTranslation();

  const columns = [
    {
      name: t('Name'),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t('Brand'),
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: t('Supplier'),
      selector: (row) => row.supplier,
      sortable: true,
    },
    {
      name: t('Identifier'),
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    if(context === "components"){
      getComponents();
    }else if(context ==="resources"){
      getResources();
    }
  };

  return (
    <div className="p-6 border border-gray-600 bg-white rounded-lg">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center ml-3">
          {" "}
          {context === "components"
            ? t('Components')
            : context === "resources"
            ? t('Resources')
            : ""}
        </h1>
        <TextInput
          placeholder={t("SearchbyNameBrandSupplierIdentifier")}
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
        paginationComponentOptions={{
          rowsPerPageText: t('RowsPerPage'),
          rangeSeparatorText: t('of'),
        }}
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
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default ComponentsTable;
