import { useContext, useState, useEffect, useRef } from "react";
import "../assets/css/header.css";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoSrc from "../assets/images/logo/3.png";

export default function Header() {
  const [isNotAtTop, setIsNotAtTop] = useState(window.scrollY !== 0);
  const eventListener = useRef(null);

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

  const navigate = useNavigate();

  // Function to handle category click
  const handleCategoryClick = (category) => {
    navigate("/search", { state: { category } });
  };

  const handleSubmit = () => {
    navigate("/search");
  };

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
              <Link to="/" className="navbar-brand text-white">
                <img src={logoSrc} height={80} alt="logo" />
              </Link>
              <div className="app">
                <div className="background">
                  <div className="search-container">
                    <form className="d-flex">
                      <input
                        className="form-control d-lg-block d-none me-2"
                        type="search"
                        placeholder="Tìm kiếm"
                        aria-label="Search"
                        onClick={handleSubmit}
                      />
                      <button
                        className="btn btn-outline-light"
                        type="submit"
                        style={{ backgroundColor: "#EC6C21", color: "white" }}
                        onClick={handleSubmit}
                      >
                        <i className="bi bi-search"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center order-lg-2 order-1">
              {!token ? (
                <Link to="/login" className="btn custom-btn d-lg-block">
                  Đăng nhập
                </Link>
              ) : (
                <>
                  <Link
                    to="/myticket"
                    className="btn custom-btn d-lg-block d-none me-3"
                  >
                    <i className="bi-ticket-perforated me-2"></i>
                    Vé của tôi
                  </Link>
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
                          style={{ border: "solid #ffffff" }}
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
                        <Link className="dropdown-item" to="/myticket">
                          <span>
                            <i className="bi bi-ticket-perforated"></i>
                          </span>{" "}
                          Vé của tôi
                        </Link>
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
                  <Link
                    to="/search"
                    state={{ category: "entertaiment" }}
                    className="nav-link"
                  >
                    Nghệ thuật
                  </Link>
                </li>

                <li className="nav-item">
                <Link
                    to="/search"
                    state={{ category: "education" }}
                    className="nav-link"
                  >
                    Giáo dục
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/search"
                    state={{ category: "workshop" }}
                    className="nav-link"
                  >
                    Workshop
                  </Link>
                </li>

                <li className="nav-item">
                <Link
                    to="/search"
                    state={{ category: "other" }}
                    className="nav-link"
                  >
                    Khác
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
