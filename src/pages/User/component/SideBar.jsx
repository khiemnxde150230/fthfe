// src/Sidebar.js
import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";

const { Sider } = Layout;

const SideBar = () => {
  const {user} = useContext(UserContext);
  return (
    <Sider style={{ height: "100vh" }}>
      <div style={{ color: "#fff", display: "flex" }}>
        <img
          src={user.avatar ? user.avatar: "https://via.placeholder.com/80"}
          alt="Profile"
          style={{ borderRadius: "50%", width: "40px", marginBottom: "10px" }}
        />
        <div
          style={{
            marginLeft: "1rem",
          }}
        >
          <div style={{ fontSize: "12px", color: "#aaa" }}>Tài khoản của</div>
          <h5 style={{ color: "#fff", margin: "5px 0" }}>{user.fullName}</h5>
        </div>
      </div>
      <div style={{ margin: "1rem" }}>
        <div key="1">
            <i class="bi bi-person me-2"></i>
            <Link to="/profile" style={{textDecoration:"none", color:"white"}}> Thông tin tài khoản</Link>
        </div>
        <div key="2" style={{ color: "#EC6C21" }}>
            <i class="bi bi-ticket-detailed me-2"></i>
            Vé đã mua
        </div>
        <div key="3">
            <i class="bi bi-calendar2-event me-2"></i>
            <Link to="/organizer/events" style={{textDecoration:"none", color:"white"}}> Sự kiện của tôi</Link>
        </div>
      </div>
    </Sider>
  );
};

export default SideBar;
