import React, { useState, useEffect } from "react";
import "./ToDoList.css";

const API_URL = "http://localhost/todolist/index.php"; // เปลี่ยน path ให้ตรงกับไฟล์ PHP

function ToDoList() {
  const [tasks, setTasks] = useState([""]);
  const [newTask, setNewTask] = useState("");
  const [listName, setListName] = useState("To-Do List");
  const [isEditingName, setIsEditingName] = useState(false);

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { task_name: newTask }]);
    setNewTask("");
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const editTask = (index, newName) => {
    const updated = [...tasks];
    updated[index].task_name = newName;
    setTasks(updated);
  };

  const moveTask = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === tasks.length - 1)
    )
      return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...tasks];
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setTasks(updated);
  };

  // บันทึก tasks ทั้งหมดลงฐานข้อมูล
  const saveTasks = () => {};

  const startEditingName = () => setIsEditingName(true);
  const finishEditingName = () => {
    if (listName.trim() === "") setListName("Untitled List");
    setIsEditingName(false);
  };

  return (
    <div className="to-do-list">
      <h1>
        {isEditingName ? (
          <input
            className="rename-list-box"
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onBlur={finishEditingName}
            onKeyDown={(e) => e.key === "Enter" && finishEditingName()}
            autoFocus
          />
        ) : (
          <>
            {listName}
            <button className="rename-list-btn" onClick={startEditingName}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-pencil-line-icon lucide-pencil-line"
              >
                <path d="M13 21h8" />
                <path d="m15 5 4 4" />
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              </svg>
            </button>
          </>
        )}
      </h1>

      <div className="add-task">
        <input
          className="add-task-box"
          type="text"
          placeholder="Enter a Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-task-btn" onClick={addTask}>
          Add
        </button>
      </div>

      <ol className="task-list">
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              className="task-rewrite-box checked"
              placeholder="Write Something Here..."
              type="text"
              value={task.task_name}
              onChange={(e) => editTask(index, e.target.value)}
            />
            <div className="manage-task-btns">
              <button
                className="move-up-btn"
                onClick={() => moveTask(index, "up")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-arrow-big-up-dash-icon lucide-arrow-big-up-dash"
                >
                  <path d="M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
                  <path d="M9 20h6" />
                </svg>{" "}
              </button>
              <button
                className="move-down-btn"
                onClick={() => moveTask(index, "down")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-arrow-big-down-dash-icon lucide-arrow-big-down-dash"
                >
                  <path d="M15 11a1 1 0 0 0 1 1h2.939a1 1 0 0 1 .75 1.811l-6.835 6.836a1.207 1.207 0 0 1-1.707 0L4.31 13.81a1 1 0 0 1 .75-1.811H8a1 1 0 0 0 1-1V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1z" />
                  <path d="M9 4h6" />
                </svg>{" "}
              </button>
              <button className="delete-btn" onClick={() => deleteTask(index)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24 "
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
            </div>
          </li>
        ))}
      </ol>

      {/* <button onClick={saveTasks}>Save</button> */}
    </div>
  );
}

export default ToDoList;
