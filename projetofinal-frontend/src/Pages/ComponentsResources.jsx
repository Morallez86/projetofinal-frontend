import React from "react";
import ComponentsTable from "../Components/ComponentsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import ComponentResourceCardDetails from "../Components/ComponentResourceCardDetails";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ComponentsResources() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const [resources, setResources] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  const getResources = async () => {
    setLoading(true); // Ensure loading is set to true each time getResources is called
    try {
      const response = await fetch(
        `${apiUrl}/resources/toTables?page=${page}&limit=${rowsPerPage}&filter=${encodeURIComponent(
          filterText
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("resources fetched successfully");
        const data = await response.json();
        setResources(data.resources);
        setTotalPages(data.totalPages);
        console.log(data);
      } else if (response.status === 401) {
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Session timeout
          return; // Exit early if session timeout
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Error fetching resources" + response.status);
      }
    } catch (error) {
      console.error("Error fetching resources" + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResources();
  }, [page, rowsPerPage, filterText]);

  const handleModalClose = () => {
    setShowModal(false);
    getResources(); // Refresh the data after creation
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-14">
        <Button className="mb-4" onClick={() => setShowModal(true)}>
          {t("CreateNewResource")}
        </Button>
        <ComponentsTable
          data={resources}
          loading={loading}
          pagination
          paginationServer
          paginationTotalRows={totalPages * rowsPerPage}
          onChangePage={(newPage) => setPage(newPage)}
          onChangeRowsPerPage={(newRowsPerPage) =>
            setRowsPerPage(newRowsPerPage)
          }
          rowsPerPage={rowsPerPage}
          filterText={filterText}
          setFilterText={setFilterText}
          context={"resources"}
          getResources={getResources}
        />
      </div>
      {showModal && (
        <ComponentResourceCardDetails
          data={{}} // Pass empty data for creation
          context="resources"
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default ComponentsResources;
