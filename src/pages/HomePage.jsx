import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import Upcoming from "./Home/UpComing";
import EventByCategory from "./Home/EventByCategory";
import "bootstrap/dist/css/bootstrap.css";
import { useContext, useEffect, useState } from "react";
import videoBg from "../assets/css/Thumel.mp4";
import forumSrc from "../assets/images/forum/forum.jpg";
import "../assets/css/header.css";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/css/bootstrap-icons.css";
import News from "./Home/News";
import "../assets/css/ticket.css";

function HomePage() {
  const navigate = useNavigate();


  const { user, token, onSetUser, onSetRender } = useContext(UserContext);

  // const handleLogout = () => {
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("user");
  //   localStorage.clear();
  //   onSetUser({
  //     data: "",
  //     token: "",
  //   });
  //   onSetRender();
  //   navigate("/login");
  //   toast.success("Đã đăng xuất!");
  // };

  return (
    <div>
      <Header isNotAtTopEnabled={true} />

      <section class="hero-section" id="section_1">
        <div class="section-overlay"></div>

        <div class="container d-flex flex-column justify-content-center align-items-center">
          <div class="col-12 mt-15 mb-15 text-center">
            <small>NỀN TẢNG CUNG CẤP VÉ SỰ KIỆN ĐẠI HỌC FPT ĐÀ NẴNG</small>{" "}
            <br />
            <h1 className="text-white mb-5 display-1 fw-bold">FPT TICKETHUB</h1>
            <small>Trở thành ban tổ chức</small> <br />
            <Link to = "/organizer/create-event" class="btn custom-btn smoothscroll">TẠO SỰ KIỆN</Link>
          </div>
        </div>
        <video
          autoPlay
          playsInline
          loop
          muted
          className="custom-video"
          poster=""
        >
          <source src={videoBg} type="video/mp4" />
        </video>
      </section>

      <Upcoming />
      <div
        className="forum mb-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          className="forum-img rounded"
          style={{ width: "85%", height: "180px", borderRadius: "12px" }}
          src={forumSrc}
          alt=""
        />
      </div>

      <EventByCategory categoryId={1} categoryName={"Nghệ thuật"} filter={"entertaiment"} /> 
      <EventByCategory categoryId={2} categoryName={"Giáo dục"} filter={"education"} />
      <EventByCategory categoryId={3} categoryName={"Workshop"} filter={"workshop"} />
      <EventByCategory categoryId={4} categoryName={"Khác"} filter={"other"} />

      <News />

      <Footer />
    </div>
  );
}

export default HomePage;
