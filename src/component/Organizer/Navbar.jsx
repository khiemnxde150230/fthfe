import { useContext, useState, useEffect, useRef } from "react";
import "../../assets/css/header.css"
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoSrc from "../../assets/images/logo/3.png";

export default function Navbar() {
  const [isNotAtTop, setIsNotAtTop] = useState(window.scrollY !== 0);
  const eventListener = useRef(null);
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();

  useEffect(() => {
    eventListener.current = window.addEventListener("scroll", () => {
      setIsNotAtTop(window.scrollY !== 0);
    });

    return () => {
      if (eventListener.current) {
        window.removeEventListener("scroll", eventListener.current);
      }
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveLink(location.pathname);
  }, []);

  const navigate = useNavigate();

  const { user, token, onSetUser, onSetRender } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.clear();
    onSetUser({
      data: "",
      token: "",
    });
    onSetRender();
    navigate("/login");
    toast.success("Đã đăng xuất!");
  };

  return (
    <>
      <div className={"sticky-top mt-0" + (isNotAtTop ? " bg-black" : "")}>
        <nav className="navbar navbar-expand-lg pt-0 pb-0">
          <div className="container">
            <div className="d-flex align-items-center">
              {
                user.roleId === 3 ? (
                  <Link to="/organizer/events" className="navbar-brand text-white">
                    <img src={logoSrc} height={80} alt="logo" />
                  </Link>
                ) : (
                  <Link to="/" className="navbar-brand text-white">
                    <img src={logoSrc} height={80} alt="logo" />
                  </Link>
                )
              }
            </div>

            <div className="d-flex align-items-center order-lg-2 order-1">
              {!token ? (
                <></>
              ) : (
                <>
                  <div className="dropdown">
                    <a
                      className="dropdown"
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {!user.avatar ? (
                        <img
                          src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                          alt="Avatar"
                          className="rounded-circle"
                          width="50"
                          height="50"
                        />
                      ) : (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="rounded-circle"
                          width="50"
                          height="50"
                          style={{ border: 'solid #ffffff' }}
                        />
                      )}
                    </a>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li>
                        {user.roleId === 3 ? (
                          <Link className="dropdown-item" to="/profile">
                            <span>
                              <i className="bi bi-person-circle"></i>
                            </span>{" "}
                            Hồ sơ ban tổ chức
                          </Link>
                        ) : (
                          <Link className="dropdown-item" to="/profile">
                            <span>
                              <i className="bi bi-person-circle"></i>
                            </span>{" "}
                            Hồ sơ người dùng
                          </Link>
                        )}
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item" onClick={handleLogout}>
                          <span>
                            <i className="bi bi-box-arrow-right"></i>
                          </span>{" "}
                          Đăng xuất
                        </a>
                      </li>
                    </ul>
                  </div>
                </>
              )}
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div
              className="collapse navbar-collapse order-lg-1 order-2"
              id="navbarNav"
            >
              <ul className="navbar-nav align-items-lg-center mx-auto">
                <li className="nav-item">
                  {/* <a className="nav-link click-scroll" href="#section_2">
                    Tạo sự kiện
                  </a> */}
                  <Link
                    to="/organizer/create-event"
                    className={`nav-link click-scroll ${
                      activeLink === "/organizer/create-event" ? "active" : ""
                    }`}
                    onClick={() => setActiveLink("/organizer/create-event")}
                  >
                    Tạo sự kiện
                  </Link>
                </li>

                <li className="nav-item">
                  {/* <a className="nav-link click-scroll" href="#section_3">
                    Sự kiện đã tạo
                  </a> */}
                  <Link
                    to="/organizer/events"
                    className={`nav-link click-scroll ${
                      activeLink === "/organizer/events" ? "active" : ""
                    }`}
                    onClick={() => setActiveLink("/organizer/events")}
                  >
                    Sự kiện đã tạo
                  </Link>
                </li>
                {user.roleId === 3 ? (
                  <li className="nav-item">
                    {/* <a className="nav-link click-scroll" href="#section_3">
                    Sự kiện đã tạo
                  </a> */}
                    <Link
                      to="/organizer/manage-staff"
                      className={`nav-link click-scroll ${
                        activeLink === "/organizer/manage-staff" ? "active" : ""
                      }`}
                      onClick={() => setActiveLink("/organizer/manage-staff")}
                    >
                      Soát vé viên
                    </Link>
                    <Link
                      to="/organizer/manage-news"
                      className={`nav-link click-scroll ${
                        activeLink === "/organizer/manage-news" ? "active" : ""
                      }`}
                      onClick={() => setActiveLink("/organizer/manage-news")}
                    >
                      Bài viết
                    </Link>
                  </li>
                ) : (
                  <></>
                )}
                {/* <li className="nav-item">
                  <a className="nav-link click-scroll" href="#section_5">
                    Thể thao
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link click-scroll" href="#section_6">
                    Khác
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}