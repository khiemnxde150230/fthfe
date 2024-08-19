import React from "react";
import "bootstrap/dist/css/bootstrap.css";

function ToForum() {
  return (
    <>
      <section className="about spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about__pic">
                <img src="img/about/about.png" alt="" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about__text">
                <div className="section-title">
                  <h2>Cộng đồng người dùng FPTTickethub</h2>
                  <h1>About me</h1>
                </div>
                <p>description gì đó</p>
                <a href="/Post" className="primary-btn">
                  THAM GIA NGAY
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ToForum;
