import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ToDoList.css";

// ตั้งค่า axios ให้ส่ง credentials
axios.defaults.withCredentials = true;

function ToDoList({ userId }) {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // state สำหรับ rename list
  const [renamingListId, setRenamingListId] = useState(null);
  const [renamingListName, setRenamingListName] = useState("");

  // state สำหรับ rename task
  const [renamingTaskId, setRenamingTaskId] = useState(null);
  const [renamingTaskTitle, setRenamingTaskTitle] = useState("");

  const fetchTasks = (listId) => {
    axios
      .get(`http://localhost:8081/tasks/${listId}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log("📋 Tasks loaded:", res.data.tasks);
          setTasks(res.data.tasks);
        }
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8081/lists/${userId}`)
        .then((res) => {
          if (res.data.Status === "Success") setLists(res.data.lists);
        })
        .catch((err) => console.error("Error fetching lists:", err));
    }
  }, [userId]);

  useEffect(() => {
    if (selectedListId) fetchTasks(selectedListId);
    else setTasks([]);
  }, [selectedListId]);

  const handleAddList = () => {
    if (!newListName) return alert("Please enter list name");
    axios
      .post("http://localhost:8081/lists", { userId, name: newListName })
      .then((res) => {
        if (res.data.Status === "Success") {
          setLists([...lists, { id: res.data.id, name: newListName }]);
          setNewListName("");
        }
      })
      .catch((err) => console.error("Error adding list:", err));
  };

  // --- เริ่ม rename list ---
  const handleRenameList = (id, currentName) => {
    setRenamingListId(id);
    setRenamingListName(currentName);
  };

  const handleSaveListName = (id) => {
    if (!renamingListName.trim()) return;
    axios
      .put(`http://localhost:8081/lists/${id}`, { name: renamingListName })
      .then((res) => {
        if (res.data.Status === "Success") {
          setLists(
            lists.map((l) =>
              l.id === id ? { ...l, name: renamingListName } : l
            )
          );
          setRenamingListId(null);
        }
      })
      .catch((err) => console.error("Error renaming list:", err));
  };
  // --- จบ rename list ---

  const handleDeleteList = (id) => {
    if (!window.confirm("Delete this list and all its tasks?")) return;
    axios
      .delete(`http://localhost:8081/lists/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setLists(lists.filter((l) => l.id !== id));
          if (selectedListId === id) setSelectedListId(null);
        }
      })
      .catch((err) => console.error("Error deleting list:", err));
  };

  const handleAddTask = () => {
    if (!newTaskTitle || !selectedListId)
      return alert("Select list & enter task");
    axios
      .post("http://localhost:8081/tasks", {
        listId: selectedListId,
        title: newTaskTitle,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          setNewTaskTitle("");
          fetchTasks(selectedListId);
        }
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  // --- เริ่ม rename task ---
  const handleRenameTask = (id, currentTitle) => {
    setRenamingTaskId(id);
    setRenamingTaskTitle(currentTitle);
  };

  const handleSaveTaskTitle = (id) => {
    if (!renamingTaskTitle.trim()) return;
    axios
      .put(`http://localhost:8081/tasks/${id}`, { title: renamingTaskTitle })
      .then((res) => {
        if (res.data.Status === "Success") {
          setTasks(
            tasks.map((t) =>
              t.id === id ? { ...t, title: renamingTaskTitle } : t
            )
          );
          setRenamingTaskId(null);
        }
      })
      .catch((err) => console.error("Error renaming task:", err));
  };
  // --- จบ rename task ---

  const handleDeleteTask = (id) => {
    if (!window.confirm("Delete this task?")) return;
    axios
      .delete(`http://localhost:8081/tasks/${id}`)
      .then((res) => {
        if (res.data.Status === "Success") {
          setTasks(tasks.filter((t) => t.id !== id));
        }
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const toggleTaskStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "complete" : "pending";
    axios
      .put(`http://localhost:8081/tasks/status/${id}`, { status: newStatus })
      .then((res) => {
        if (res.data.Status === "Success") {
          setTasks(
            tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
          );
        }
      })
      .catch((err) => console.error("Error toggling status:", err));
  };

  const selectedList = lists.find((l) => l.id === selectedListId);

  const moveTask = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(index, 1);
    newTasks.splice(targetIndex, 0, movedTask);
    setTasks(newTasks);

    // อัปเดตลำดับในฐานข้อมูล
    axios
      .put(`http://localhost:8081/tasks/reorder`, {
        listId: selectedListId,
        tasks: newTasks.map((t, i) => ({ id: t.id, position: i + 1 })),
      })
      .catch((err) => console.error("Error updating task order:", err));
  };

  // ✅ ตั้งวันหมดอายุ
  const handleSetDueDate = (id, dueDate) => {
    axios
      .put(`http://localhost:8081/tasks/due/${id}`, { due_date: dueDate })
      .then((res) => {
        if (res.data.Status === "Success") {
          setTasks(
            tasks.map((t) => (t.id === id ? { ...t, due_date: dueDate } : t))
          );
        }
      })
      .catch((err) => console.error("Error setting due date:", err));
  };

  // ✅ เพิ่มหมวดหมู่หรือแท็ก
  const handleSetCategory = (id, category) => {
    axios
      .put(`http://localhost:8081/tasks/category/${id}`, { category })
      .then((res) => {
        if (res.data.Status === "Success") {
          setTasks(tasks.map((t) => (t.id === id ? { ...t, category } : t)));
        }
      })
      .catch((err) => console.error("Error setting category:", err));
  };

  return (
    <div className="container">
      <div className="to-do-list">
        <div className="list">
          <h2>Your Lists</h2>
          <div className="list-add-bar">
            <input
              className="add-list-box"
              type="text"
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button className="add-list" onClick={handleAddList}>
              Add List
            </button>
          </div>
          <ul className="">
            {lists.map((list) => (
              <li key={list.id}>
                <button className="list-select-btn">
                  <span onClick={() => setSelectedListId(list.id)}>
                    {renamingListId === list.id ? (
                      <input
                        type="text"
                        value={renamingListName}
                        onChange={(e) => setRenamingListName(e.target.value)}
                        onBlur={() => handleSaveListName(list.id)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSaveListName(list.id)
                        }
                        autoFocus
                        className="rename-input"
                      />
                    ) : (
                      list.name
                    )}
                  </span>
                  <button className="dropdown">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 -3 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                    <div className="dropdown-content">
                      <button
                        className="list-rename"
                        onClick={() => handleRenameList(list.id, list.name)}
                      >
                        Rename
                      </button>
                      <button
                        className="list-delete"
                        onClick={() => handleDeleteList(list.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </button>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="task">
          <h2 className="task-navbar">
            Selecting List - {selectedList ? selectedList.name : "None"}
          </h2>
          {selectedListId ? (
            <>
              <div className="task-add-bar">
                <input
                  className="add-task-box"
                  type="text"
                  placeholder="New task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <button className="add-task" onClick={handleAddTask}>
                  Add Task
                </button>
              </div>

              <ul className="task-lists">
                {tasks.map((task, index) => (
                  <li
                    key={task.id}
                    style={{
                      opacity: task.status === "complete" ? 0.5 : 1,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <button
                      className="task-status"
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                    >
                      {task.status === "pending" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-clock-icon lucide-clock"
                        >
                          <path d="M12 6v6l4 2" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check-icon lucide-check"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </button>

                    <span className="task-name">
                      {renamingTaskId === task.id ? (
                        <input
                          type="text"
                          value={renamingTaskTitle}
                          onChange={(e) => setRenamingTaskTitle(e.target.value)}
                          onBlur={() => handleSaveTaskTitle(task.id)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSaveTaskTitle(task.id)
                          }
                          autoFocus
                          className="rename-input"
                        />
                      ) : (
                        `${task.title} - ${task.status}`
                      )}
                    </span>

                    <div className="task-manage">
                      <button
                        className="task-rename"
                        onClick={() => handleRenameTask(task.id, task.title)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-pencil-icon lucide-pencil"
                        >
                          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                      <button
                        className="task-delete"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-trash2-icon lucide-trash-2"
                        >
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                      <button
                        className="task-move-up"
                        onClick={() => moveTask(index, -1)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-move-up-icon lucide-move-up"
                        >
                          <path d="M8 6L12 2L16 6" />
                          <path d="M12 2V22" />
                        </svg>
                      </button>
                      <button
                        className="task-move-down"
                        onClick={() => moveTask(index, 1)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-move-down-icon lucide-move-down"
                        >
                          <path d="M8 18L12 22L16 18" />
                          <path d="M12 2V22" />
                        </svg>
                      </button>
                      <input
                        className="task-date"
                        type="date"
                        value={task.due_date ? task.due_date.split("T")[0] : ""}
                        onChange={(e) =>
                          handleSetDueDate(task.id, e.target.value)
                        }
                      />
                      <input
                        className="task-catagory"
                        type="text"
                        placeholder="Category"
                        value={task.category || ""}
                        onChange={(e) =>
                          handleSetCategory(task.id, e.target.value)
                        }
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Select a list to view tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToDoList;
