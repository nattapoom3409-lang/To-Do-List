import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ToDoList from "./ToDoList";
import "./Home.css";

function Home() {
    const [auth, setAuth] = useState(false);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8081", { withCredentials: true })
            .then((res) => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setUserId(res.data.id);
                    setName(res.data.name);
                } else {
                    setAuth(false);
                    setMessage(res.data.Message);
                }
            });
    }, []);

    const handleLogout = () => {
        axios.get("http://localhost:8081/logout", { withCredentials: true })
            .then((res) => {
                if (res.data.Status === "Success") {
                    window.location.reload();
                } else {
                    alert("error");
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            {auth ? (
                <div className="user-display">
                    <div className="user-display-login" style={{ zIndex: 1 }}>
                        <h1>Welcome, {name}</h1>
                        <button onClick={handleLogout} className="tologout">Logout<svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg></button>
                    </div>
                    {/* ✅ Show ToDoList if logged in */}
                    {userId && <ToDoList className="to-do-list" style={{ zIndex: 0 ,minWidth: "300px", paddingTop: "200px" }}userId={userId} />}
                </div>
            ) : (
                <div className="user-display">
                    <div className="user-display-logout">
                        <h1>{message}</h1>
                        <h1>Login Now</h1>
                        <Link to='/login' type='button' className="tologin">Login</Link>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Home;
