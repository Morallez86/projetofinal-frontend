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
      <div className="mb-6 flex justify-between items-center flex-wrap">
        <h1 className="text-3xl font-bold text-center ml-3 w-full md:w-auto">
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
          className="mt-4 md:mt-0 w-full md:w-1/4"
        />
      </div>
      <div className="hidden md:block">
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
      </div>
      <div className="md:hidden">
          {data.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg" onClick={() => { setSelectedRow(item); setIsModalOpen(true); }}>
              <h2 className="text-lg font-bold"> Name: {item.name}</h2>
              <p>Brand: {item.brand}</p>
              <p>Supplier: {item.supplier}</p>
              <p>Identifier: {item.identifier}</p>
            </div>
          ))}
        </div>

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
