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

function AddTaskCard({ popUpShow, setPopUpShow, setTasks }) {
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const [users, setUsers] = useState([]);
  const [dependentTasks, setDependentTasks] = useState([]);
  const [restUsers, setRestUsers] = useState([]);
  const [warning, setWarning] = useState(false);
  const [warningData, setWarningData] = useState(false);
  const navigate = useNavigate();
  const handleSessionTimeout = () => {
    navigate("/", { state: { showSessionTimeoutModal: true } });
  };

  const { projectId } = useParams();

  const [formData, setFormData] = useState({
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeSelect = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      userName: selectedOption.label,
    }));
  };

  const handleRemoveContributor = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      contributors: formData.contributors.filter(
        (contributor) => contributor.label !== selectedOption.label
      ),
    }));
  };

  const handleIdSelect = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      userId: selectedOption.value,
    }));
  };

  useEffect(() => {
    getUsersFromProject();
    console.log(users);
  }, []);

  useEffect(() => {
    setRestUsers(users.filter((user) => user.username !== formData.userName));
  }, [users, formData.userName]);

  useEffect(() => {
    getDependentTasks();
    console.log(formatDateForBackend(formData.plannedStartingDate));
  }, [formData.plannedStartingDate]);

  const formatDateForBackend = (dateString) => {
    if (!dateString) {
      return null; // Handle the case where dateString is null or undefined
    }

    // Append the time part to the date string
    const formattedDate = `${dateString} 00:00:00`;
    console.log(formattedDate);

    return formattedDate;
  };

  const getDependentTasks = () => {
    const plannedStartingDate = formatDateForBackend(
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
          const dependentTasksData = await response.json();
          console.log(dependentTasksData);
          setDependentTasks(dependentTasksData);
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
          console.log("Error fetching dependent tasks: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Error fetching dependent tasks:", error);
      });
  };

  const getUsersFromProject = () => {
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
          const usersData = await response.json();
          console.log(usersData);
          setUsers(usersData);
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
          console.log("Error fetching users: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: AddedAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSubmit = async () => {
    const contributorsAsString = formData.contributors
      .map((contributor) => contributor.label)
      .join(",");

    setWarning(false);
    setWarningData(false);

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
      return;
    }

    console.log(stop);

    fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        contributors: contributorsAsString,
        plannedStartingDate: formatDateForBackend(formData.plannedStartingDate),
        plannedEndingDate: formatDateForBackend(formData.plannedEndingDate),
      }),
    })
      .then(async (response) => {
        if (response.status === 201) {
          console.log("Task added with success");
          setAnimationPlayed(true);
          setShowSuccessText(true);
          setTimeout(() => {
            setPopUpShow(false);
            setShowSuccessText(false);
            console.log(formData);
          }, 2000);
          setTasks((prevTasks) => [...prevTasks, formData]);
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
            Create a task
          </h3>
          <form className="space-y-3">
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="title" value="Task tile" />
                <TextInput
                  placeholder="Choose a title for the task"
                  id="title"
                  name="title"
                  defaultValue={""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="description" value="Task description" />
                <Textarea
                  id="description"
                  name="description"
                  className="h-[10rem] resize-none"
                  defaultValue={""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="responsible" value="Responsible" />
                <Select
                  options={users.map((user) => ({
                    value: user.userId,
                    label: user.username,
                  }))}
                  placeholder="Select a responsible"
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
                  value="Planned Starting Date"
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
                  value="Planned Ending Date"
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
                <Label htmlFor="priority" value="Priority" />
                <Select
                  options={[
                    { value: 100, label: "Low" },
                    { value: 200, label: "Medium" },
                    { value: 300, label: "High" },
                  ]}
                  placeholder="Select a priority"
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
                <Label htmlFor="dependentTasks" value="Dependent task" />
                <Select
                  options={dependentTasks.map((task) => ({
                    value: task.id,
                    label: task.title,
                  }))}
                  placeholder="Select dependent task"
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
                  value="Additional Executors"
                />
                <CreatableSelect
                  key={formData.userName}
                  isMulti
                  options={restUsers.map((user) => ({
                    value: user.id,
                    label: user.username,
                  }))}
                  placeholder="Select additional executors"
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
                <Button onClick={handleSubmit}>Add task</Button>
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
                    height={250}
                    width={250}
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
                    Added with success
                  </div>
                )}
                {warning && (
                  <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium"> </span> The required fields
                    are not all filled in
                  </Alert>
                )}
                {warningData && (
                  <Alert color="failure" icon={HiInformationCircle}>
                    <span className="font-medium"> </span> The end date cannot
                    be earlier than the start date
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
