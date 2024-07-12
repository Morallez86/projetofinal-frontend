import React, { useEffect } from "react";
import AddedAnimation from "../Assets/Added.json";
import { Modal, Button, Label, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import Lottie from "react-lottie";
import Select from "react-select";
import { useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AddTaskCard({ popUpShow, setPopUpShow, setTasks, allTask }) {
  const token = useUserStore((state) => state.token); // Obter o token do utilizador
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter a URL da API
  const [animationPlayed, setAnimationPlayed] = useState(false); // Gerir a animação
  const [showSuccessText, setShowSuccessText] = useState(false); // Definir o texto de sucesso exibido
  const [users, setUsers] = useState([]); // Definir os utilizadores
  const [dependentTasks, setDependentTasks] = useState([]); // Definir as tarefas dependentes
  const [restUsers, setRestUsers] = useState([]); // Definir os utilizadores restantes excluindo o selecionado como responsável
  const [warning, setWarning] = useState(false); // Definir o aviso
  const [warningData, setWarningData] = useState(false); // Definir o aviso de dados
  const [maxEndDate, setMaxEndDate] = useState(null);
  const { t } = useTranslation(); // Função de tradução
  const navigate = useNavigate();
  const handleSessionTimeout = () => {
    // Gerir o tempo limite da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  const { projectId } = useParams(); // Obter o id do projeto da URL

  const [formData, setFormData] = useState({
    // Definir os dados do formulário
    projectId: projectId,
    title: "",
    description: "",
    userName: "",
    plannedStartingDate: "",
    plannedEndingDate: "",
    priority: "",
    dependencies: [],
    contributors: [],
    status: 100,
    userId: "",
  });

  useEffect(() => {
    if (allTask.length > 0) {
      // Filter out any empty or invalid tasks
      const validTasks = allTask.filter(
        (task) => Array.isArray(task) && task.length === 5
      );

      if (validTasks.length > 0) {
        // Convert each task to a Date object and find the maximum
        const maxEndDate = new Date(
          Math.max.apply(
            null,
            validTasks.map((task) => {
              const [year, month, day, hour, minute] = task;
              // Month in JS Date object is 0-based (0 = January)
              return new Date(year, month - 1, day, hour, minute);
            })
          )
        );

        // Update state with the maximum end date
        setMaxEndDate(maxEndDate.toISOString().split("T")[0]);
      }
    }
  }, [allTask]);

  const handleChange = (event) => {
    // Gerir a mudança
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeSelect = (selectedOption) => {
    // Gerir a mudança de seleção
    setFormData((prevData) => ({
      ...prevData,
      userName: selectedOption.label,
    }));
  };

  const handleRemoveContributor = (selectedOption) => {
    // Gerir a remoção de contribuidor
    setFormData((prevData) => ({
      ...prevData,
      contributors: formData.contributors.filter(
        (contributor) => contributor.label !== selectedOption.label
      ),
    }));
  };

  const handleIdSelect = (selectedOption) => {
    // Gerir a seleção de id
    setFormData((prevData) => ({
      ...prevData,
      userId: selectedOption.value,
    }));
  };

  useEffect(() => {
    // Obter os utilizadores do projeto
    getUsersFromProject();
  }, []);

  useEffect(() => {
    setRestUsers(users.filter((user) => user.username !== formData.userName)); // Definir os utilizadores restantes excluindo o selecionado como responsável
  }, [users, formData.userName]); // Dependências que fazem ativar o useEffect

  useEffect(() => {
    // Obter as tarefas dependentes
    getDependentTasks();
  }, [formData.plannedStartingDate]); // Dependências que fazem ativar o useEffect

  const formatDateForBackend = (dateString) => {
    // Formatar a data para o backend
    if (!dateString) {
      return null;
    }

    const formattedDate = `${dateString} 00:00:00`;

    return formattedDate;
  };

  const getDependentTasks = () => {
    // Obter as tarefas dependentes
    const plannedStartingDate = formatDateForBackend(
      // Formatar a data de início planeada
      formData.plannedStartingDate
    );
    fetch(
      `${apiUrl}/projects/${projectId}/possibleDependentTasks?plannedStartingDate=${plannedStartingDate}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (response) => {
        if (response.status === 200) {
          // Se a resposta for 200
          const dependentTasksData = await response.json();

          setDependentTasks(dependentTasksData); // Definir as tarefas dependentes
        } else if (response.status === 401) {
          // Se a resposta for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Tempo limite da sessão
            return;
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else {
          console.log("Error fetching dependent tasks: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Error fetching dependent tasks:", error);
      });
  };

  const getUsersFromProject = () => {
    // Obter os utilizadores do projeto
    fetch(`${apiUrl}/projects/${projectId}/users`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          // Se a resposta for 200
          const usersData = await response.json();

          setUsers(usersData);
        } else if (response.status === 401) {
          // Se a resposta for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Tempo limite da sessão
            return;
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else {
          console.log("Error fetching users: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const defaultOptions = {
    // Opções padrão
    loop: false,
    autoplay: false,
    animationData: AddedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSubmit = async () => {
    // Submeter
    const contributorsAsString = formData.contributors
      .map((contributor) => contributor.label)
      .join(","); // Definir os contribuidores como string

    setWarning(false);
    setWarningData(false); //Limpa os avisos

    let stop = 0;
    if (
      !formData.title ||
      !formData.description ||
      !formData.userName ||
      !formData.plannedStartingDate ||
      !formData.plannedEndingDate ||
      !formData.priority
    ) {
      setWarning(true);
      stop = 1;
    }

    if (formData.plannedStartingDate > formData.plannedEndingDate) {
      setWarningData(true);
      stop = 1;
    }



    if (stop != 0) {
      //para ele percorrer os 2 alertas
      return;
    }

    fetch(`${apiUrl}/tasks`, {
      // Adicionar tarefa
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        contributors: contributorsAsString,
        plannedStartingDate: formatDateForBackend(formData.plannedStartingDate), // Formatar a data de início planeada
        plannedEndingDate: formatDateForBackend(formData.plannedEndingDate), // Formatar a data de fim planeada
      }),
    })
      .then(async (response) => {
        if (response.status === 201) {
          // Se a resposta for 201
          setAnimationPlayed(true); // Ativar a animação
          setShowSuccessText(true); // Exibir o texto de sucesso
          setTimeout(() => {
            setPopUpShow(false); // Fechar o popup
            setShowSuccessText(false); // Esconder o texto de sucesso
          }, 2000); // Fechar o popup após 2 segundos
          setTasks((prevTasks) => [...prevTasks, formData]); // Adicionar a tarefa
        } else if (response.status === 401) {
          // Se a resposta for 401
          const data = await response.json();
          const errorMessage = data.message || "Unauthorized";

          if (errorMessage === "Invalid token") {
            handleSessionTimeout(); // Tempo limite da sessão
            return;
          } else {
            console.error("Error updating seen status:", errorMessage);
          }
        } else {
          console.log("Error adding task: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  return (
    <Modal
      show={popUpShow}
      size="xl"
      onClose={() => {
        setPopUpShow(false);
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center overflow-x-hidden overflow-y-hidden">
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("Create a task")}
          </h3>
          <form className="space-y-3">
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="title" value={t("Title")} />
                <TextInput
                  placeholder={t("Choose a title for the task")}
                  id="title"
                  name="title"
                  defaultValue={""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="description" value={t("Description")} />
                <Textarea
                  id="description"
                  name="description"
                  className="h-[10rem] resize-none"
                  defaultValue={""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="responsible" value={t("Responsible")} />
                <Select
                  options={users.map((user) => ({
                    value: user.userId,
                    label: user.username,
                  }))}
                  placeholder={t("Select a responsible")}
                  maxMenuHeight={160}
                  name="userName"
                  onChange={(selectedOptions) => {
                    handleChangeSelect(selectedOptions);
                    handleRemoveContributor(selectedOptions);
                    handleIdSelect(selectedOptions);
                  }}
                />
              </div>
              <div>
                <Label
                  htmlFor="plannedStartingDate"
                  value={t("Planned Starting Date")}
                />
                <TextInput
                  id="plannedStartingDate"
                  name="plannedStartingDate"
                  type="date"
                  defaultValue={""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label
                  htmlFor="plannedEndingDate"
                  value={t("Planned Ending Date")}
                />
                <TextInput
                  id="plannedEndingDate"
                  name="plannedEndingDate"
                  type="date"
                  defaultValue={""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="priority" value={t("Priority")} />
                <Select
                  options={[
                    { value: 100, label: t("LOW") },
                    { value: 200, label: t("MEDIUM") },
                    { value: 300, label: t("HIGH") },
                  ]}
                  placeholder={t("Select a priority")}
                  maxMenuHeight={160}
                  name="priority"
                  onChange={(selectedOption) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      priority: selectedOption.value,
                    }));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="dependentTasks" value={t("Dependent task")} />
                <Select
                  options={dependentTasks.map((task) => ({
                    value: task.id,
                    label: task.title,
                  }))}
                  placeholder={t("Select dependent task")}
                  maxMenuHeight={160}
                  name="dependencies"
                  isMulti
                  onChange={(selectedOptions) => {
                    const selectedIds = selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : [];
                    setFormData((prevData) => ({
                      ...prevData,
                      dependencies: selectedIds,
                    }));
                  }}
                />
              </div>
              <div>
                <Label
                  htmlFor="additionalExecutors"
                  value={t("Additional Executors")}
                />
                <CreatableSelect
                  key={formData.userName}
                  isMulti
                  options={restUsers.map((user) => ({
                    value: user.id,
                    label: user.username,
                  }))}
                  placeholder={t("Select additional executors")}
                  maxMenuHeight={160}
                  name="contributors"
                  value={formData.contributors}
                  onChange={(selectedOptions) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      contributors: selectedOptions,
                    }));
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-0">
              <div className="flex justify-center items-center space-x-2">
                <Button onClick={handleSubmit}>{t("Create task")}</Button>
                <div
                  id="icon-element"
                  className="pointer-events-none flex items-center justify-center"
                  style={{
                    zIndex: 1,
                    transform: "scale(0.7)",
                  }}
                >
                  <Lottie
                    options={defaultOptions}
                    height={150}
                    width={150}
                    isStopped={!animationPlayed}
                    isPaused={!animationPlayed}
                    eventListeners={[
                      {
                        eventName: "complete",
                        callback: () => {
                          setAnimationPlayed(false);
                        },
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                {showSuccessText && (
                  <div className="animate-pulse text-green-500 font-bold">
                    {t("Added with success")}
                  </div>
                )}
                {warning && (
                  <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium"> </span>{" "}
                    {t("The required fields are not all filled in")}
                  </Alert>
                )}
                {warningData && (
                  <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium"> </span>{" "}
                    {t(
                      "The end date cannot be earlier than the start date or after the end of the project"
                    )}
                  </Alert>
                )}
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddTaskCard;
