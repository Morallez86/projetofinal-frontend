import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LogoutButton from "../Components/LogoutButton";
import Photo from "../Components/Photo";
import EditProfileButton from "../Components/EditProfileButton";
import { userStore } from "../stores/UserStore";
import Modal from "react-modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Message from "../Components/Message";
import WebSocketChat from "../Components/WebSocketChat";
import { useRef } from "react";
import NotificationIcon from "../Components/NotificationIcon";
import translations from "../Translation/translation";

function UserProfile() {
  const { username } = useParams();
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const token = userStore((state) => state.token);
  const allUsers = userStore((state) => state.allUsers);
  const userPicked = allUsers.find((user) => user.username === username);
  const sender = userStore((state) => state.loginUser.username);
  const [messagesTotal, setMessagesTotal] = useState([]);
  const messageContainerRef = useRef(null);
  const notifications = userStore((state) => state.notification);
  const notCheckedNotification = userStore(
    (state) => state.notCheckedNotification
  );
  const navigate = useNavigate();
  const language = userStore((state) => state.language);
  const {
    tasksLink,
    usersTableLink,
    deletedTasksLink,
    dashboardLink,
    usernameLabel,
    emailLabel,
    nameLabel,
    photoLabel,
    totalTasks,
    tasksTodo,
    tasksDoing,
    tasksDone,
    Typeyourmessagehere,
  } = translations[language];

  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messagesTotal]);

  const handleReceivedMessage = (message) => {
    console.log("receive", message);
    setReceivedMessage(message);
    setMessagesTotal((prevMessages) => [
      ...prevMessages,
      (message = {
        text: message.text,
        sender: message.sender,
        messageDateTime: message.messageDateTime,
        receptor: message.receptor,
      }),
    ]);
  };

  WebSocketChat(token, handleReceivedMessage);

  useEffect(() => {
    getTasksInfo();
    getTradedMsgs();
  }, []);

  const [data, setData] = useState({
    name: userPicked.name,
    email: userPicked.email,
    username: username,
    photo: userPicked.userPhoto,
    tasks: [],
    tasksTODO: [],
    tasksDOING: [],
    tasksDONE: [],
  });

  const closeModal = () => {
    setModalIsOpen(false);
    navigate(`/usersTable`, { replace: true });
  };

  const getTasksInfo = () => {
    fetch(
      `http://localhost:8080/projecto5backend/rest/task/byUser/${username}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          token: token,
        },
      }
    ).then(async function (response) {
      if (response.status === 403) {
        console.log("User with this token is not found");
      } else if (response.status === 401) {
        alert("Token timer expired, please login again.");
        navigate("/goBackInitialPage", { replace: true });
      } else if (response.status === 200) {
        const tasks = await response.json();
        const updatedData = {
          ...data,
          tasks: tasks,
          tasksTODO: [],
          tasksDOING: [],
          tasksDONE: [],
        };
        tasks.map((task) => {
          if (task.status === 10) {
            updatedData.tasksTODO.push(task);
          } else if (task.status === 20) {
            updatedData.tasksDOING.push(task);
          } else if (task.status === 30) {
            updatedData.tasksDONE.push(task);
          }
        });
        setData(updatedData);
      }
    });
  };

  const handleEdit = () => {
    console.log("Edit");
  };

  const getTradedMsgs = () => {
    fetch(`http://localhost:8080/projecto5backend/rest/msg/tradedMsgs`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: token,
        sender: sender,
        receptor: username,
      },
    }).then(async function (response) {
      if (response.status === 403) {
        console.log("User with this token is not found");
      } else if (response.status === 200) {
        const messages = await response.json();

        setMessagesTotal(messages);
      } else if (response.status === 401) {
        alert("Token timer expired, please login again.");
        navigate("/goBackInitialPage", { replace: true });
      }
    });
  };

  const handleSend = () => {
    const message = document.querySelector(".message-input").value;
    const msg = {
      text: message,
      sender: sender,
      receptor: username,
      messageDateTime: new Date(),
    };
    fetch(`http://localhost:8080/projecto5backend/rest/msg/create`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(msg),
    }).then(async function (response) {
      if (response.status === 403) {
        console.log("User with this token is not found");
      } else if (response.status === 401) {
        alert("Token timer expired, please login again.");
        navigate("/goBackInitialPage", { replace: true });
      } else if (response.status === 201) {
        console.log("Message sent");
      }
    });
  };

  const userPhoto = userStore.getState().userPhoto;
  const firstName = userStore.getState().loginUser.name.split(" ")[0];
  const role = userStore.getState().loginUser.role;
  return (
    <div className="App" id="outer-container">
      <header className="header" id="header-app">
        <h1>Scrum Board</h1>
        <div className="links">
          <h2 className="tasks-link">
            <Link to="/htmlDefault "> {tasksLink} </Link>
          </h2>
          <h2 className="Deleted-tasks-link">
            {(role === "Owner" || role === "user") && (
              <Link to="/deletedTasks"> {deletedTasksLink}</Link>
            )}
          </h2>
          <h2 className="users-link">
            <Link to="/users">{usersTableLink}</Link>
          </h2>
          <h2 className="dashboard-link">
            {role === "Owner" && <Link to="/dashboard">{dashboardLink}</Link>}
          </h2>
        </div>
        <Photo src={userPhoto} />
        <h2> {firstName} </h2>
        <NotificationIcon count={notCheckedNotification.length} />
        <EditProfileButton />
        <LogoutButton />
      </header>
      <div className="container">
        <main className="main" id="main-app">
          <div className="modal-button-container"></div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="custom-modal"
            overlayClassName="custom-overlay"
          >
            <div className="modal-content">
              <h2>User Profile</h2>
              <label>
                {usernameLabel}{" "}
                <input type="text" value={data.username} readOnly />
              </label>
              <label>
                {nameLabel} <input type="text" value={data.name} readOnly />
              </label>
              <label>
                {emailLabel} <input type="email" value={data.email} readOnly />
              </label>
              <label>
                {photoLabel} <input type="text" value={data.photo} readOnly />
              </label>
              <div className="circle-photo">
                <h3> {photoLabel} </h3>
                <Photo src={data.photo} variant={2} />
              </div>
              <h3>
                {totalTasks} {data.tasks.length}
              </h3>

              <h3>
                {" "}
                {tasksTodo} {data.tasksTODO.length}{" "}
              </h3>
              <h3>
                {" "}
                {tasksDoing} {data.tasksDOING.length}{" "}
              </h3>
              <h3>
                {" "}
                {tasksDone} {data.tasksDONE.length}{" "}
              </h3>
              <div
                className="message-container-withscroll"
                ref={messageContainerRef}
              >
                {messagesTotal.map((message) => (
                  <Message
                    key={message.id}
                    text={message.text}
                    checked={message.checked}
                    sender={message.sender}
                    id={message.id}
                  />
                ))}
              </div>
              <div className="message-section">
                <textarea
                  className="message-input"
                  placeholder={Typeyourmessagehere}
                ></textarea>
                <button className="buttonModal" onClick={handleSend}>
                  Send
                </button>
              </div>
              <button className="buttonModal" onClick={closeModal}>
                Close
              </button>
            </div>
          </Modal>
        </main>
      </div>

      <footer className="footer" id="footer-app">
        {/* Conteúdo do footer */}
      </footer>
    </div>
  );
}

export default UserProfile;
