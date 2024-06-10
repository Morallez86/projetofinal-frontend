import React, { useState } from "react";
import "../general.css";
import { categoriesStore } from "../stores/CategoriesStore";
import { userStore } from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
import translations from "../Translation/translation";



function TaskInfo({
  isOpen,
  onClose,
  taskName,
  taskDescription,
  priority,
  category,
  startDate,
  endDate,
  taskId,
  status,
}) {
  const token = userStore.getState().token;
  const categories = categoriesStore.getState().categories;
  const counter = userStore((state) => state.counter);
  const navigate = useNavigate();
  const language = userStore((state) => state.language);
  const { taskInfo, chooseACategory, chooseAStatus, todoName, doingName, doneName, chooseAPrority, low, medium, high, initialDate,finalDate, confirmm, cancel, deletee, edit, statuS, categoryy, taskDescriptionn, taskNamee, priorityy } = translations[language];


  const updateCounter = userStore((state) => state.updateCounter);

  const priorityMapping = {
    Low: 100,
    Medium: 200,
    High: 300,
  };

  const anotherPriMapping = {
    100: "Low",
    200: "Medium",
    300: "High",
  };

  const [formData, setFormData] = useState({
    title: taskName,
    description: taskDescription,
    category: category,
    startDate: startDate,
    endDate: endDate,
    priority: priority,
    id: taskId,
    status: status,
  });

  const [isEditable, setIsEditable] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormData(() => ({ ...formData, [name]: value }));
    console.log("***", formData);
  };

  const handleConfirm = () => {
    console.log("1º", formData);
    console.log(formData.priority);

    if (formData.priority == undefined || formData.priority == null) {
      console.log("Priority is required");
      formData.priority = priority;
    } else {
      formData.priority = priorityMapping[formData.priority];
    }

    console.log("2º", formData);

    if (formData.startDate > formData.endDate) {
      alert("The initial date must be before the final date");
      setFormData({
        title: taskName,
        description: taskDescription,
        category: category,
        startDate: startDate,
        endDate: endDate,
        priority: priority,
        id: taskId,
        status: status,
      });
      setIsEditable(false);
      onClose();
    } else if (
      formData.title === "" ||
      formData.description === "" ||
      formData.category === "" ||
      formData.startDate === "" ||
      formData.endDate === "" ||
      formData.priority === ""
    ) {
      alert("All elements are required");
      setFormData({
        title: taskName,
        description: taskDescription,
        category: category,
        startDate: startDate,
        endDate: endDate,
        priority: priority,
        id: taskId,
        status: status,
      });
      setIsEditable(false);
      onClose();
    } else {
      fetch("http://localhost:8080/projecto5backend/rest/task/update", {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(formData),
      }).then(function (response) {
        if (response.status === 401) {
          alert("Unauthorized");
        } else if (response.status === 406) {
          alert("Failed. Task not updated. All elements are required");
        } else if (response.status === 400) {
          alert("Failed. Task not updated");
        } else if (response.status === 403) {
          alert("This task doesn't belong to you");
          setFormData({
            title: taskName,
            description: taskDescription,
            category: category,
            startDate: startDate,
            endDate: endDate,
            priority: priority,
            id: taskId,
            status: status,
          });
          setIsEditable(false);
          onClose();
        } else if (response.status === 200) {
          console.log("Task updated");
          updateCounter(counter + 1);
          setIsEditable(false);
          onClose();
        }
      });
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleDelete = () => {
    const id = formData.id;
    fetch(`http://localhost:8080/projecto5backend/rest/task/block/${id}`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: token,
      },
    }).then(function (response) {
      if (response.status === 401) {
        alert("Unauthorized");
      } else if (response.status === 400) {
        alert("Failed. Your role have not permisson to that action");
      } else if (response.status === 200) {
        updateCounter(counter - 1);
        onClose();
      } else if (response.status === 403) {
        alert("Token timer expired, please login again.");
        navigate("/goBackInitialPage", { replace: true });
      }
    });
  };

  if (!isOpen) {
    return null;
  }
  const handleClose = () => {
    setIsEditable(false);
    onClose();
  };

  return (
    <div className="modal" id="taskInfoModal">
      <div className="modal-content">
        <h2 className="h2">{taskInfo}</h2>

        <label className="h2" htmlFor="taskName">
          {taskNamee}
        </label>
        <input
          type="text"
          id="taskName"
          name="title"
          value={formData.title}
          onChange={handleChange}
          readOnly={!isEditable}
        />
        <label className="h2" htmlFor="taskDescription">
          {taskDescriptionn}
        </label>
        <input
          type="text"
          id="taskDescription"
          name="description"
          value={formData.description}
          onChange={handleChange}
          readOnly={!isEditable}
        />
        <label className="h2" htmlFor="category">
          {categoryy}
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={!isEditable}
        >
          <option value="">{chooseACategory}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <label className="h2" htmlFor="status">
          {statuS}
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={!isEditable}
        >
          <option value="">{chooseAStatus}</option>
          <option value="10">{todoName} </option>
          <option value="20">{doingName} </option>
          <option value="30">{doneName} </option>
          
        </select>
        <label className="h2" htmlFor="priority">
          {priorityy}
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue={anotherPriMapping[priority]}
          onChange={handleChange}
          disabled={!isEditable}
        >
          <option value="">{chooseAPrority}</option>
          <option value="Low">{low} &#x1F7E2;</option>
          <option value="Medium">{medium} &#x1F7E1; </option>
          <option value="High">{high} &#x1F534; </option>
        </select>
        <label className="h2" htmlFor="startDate">
          {initialDate}
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          readOnly={!isEditable}
        />
        <label className="h2" htmlFor="endDate">
        {finalDate}
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          readOnly={!isEditable}
        />
        {isEditable ? (
          <>
            <button className="button" onClick={handleConfirm}>
              {" "}
              {confirmm}{" "}
            </button>
            <button className="button" onClick={handleClose}>
              {" "}
              {cancel}{" "}
            </button>
            <button className="button" onClick={handleDelete}>
              {" "}
              {deletee}{" "}
            </button>
          </>
        ) : (
          <>
            <button className="button" onClick={handleEditClick}>
              {edit}
            </button>
            <button className="button" onClick={handleClose}>
              {cancel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskInfo;
