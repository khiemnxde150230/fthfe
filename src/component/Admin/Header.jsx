import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import logo from '../../assets/images/logo/3.png';
import logo2 from '../../assets/images/logo/logo2.png';
import { toast } from 'react-toastify';

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const { user, onSetUser, onSetRender } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.clear();
    onSetUser({
      data: '',
      token: '',
    });
    onSetRender();
    navigate('/login');
    toast.success('Đã đăng xuất!');
  };

  return (
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-2">
          <div class="app-brand">
            <a href="/" class="d-lg-block d-none">
              <img src={logo} class="logo" alt="FPTTicketHub" />
            </a>
            <a href="/admin/dashboard" class="d-lg-none d-md-block">
              <img src={logo2} class="logo2" alt="FPTTicketHub" />
            </a>
          </div>
        </div>
        <div class="col-md-9 col-10">
          <div class="header-actions d-flex align-items-center justify-content-end">
            <div class="dropdown ms-2">
              <a
                class="dropdown-toggle d-flex align-items-center user-settings"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={user.avatar}
                  class="img-3x m-2 me-0 rounded-5"
                  alt="Avatar"
                />
              </a>
              <div class="dropdown-menu dropdown-menu-end dropdown-menu-sm shadow-sm gap-3">
                <Link
                  to="/profile"
                  class="dropdown-item d-flex align-items-center py-2"
                >
                  <i class="icon-smile fs-4 me-3"></i>Hồ sơ
                </Link>
                <a
                  onClick={handleLogout}
                  class="dropdown-item d-flex align-items-center py-2"
                >
                  <i class="icon-log-out fs-4 me-3"></i>Đăng xuất
                </a>
              </div>
            </div>
            <button
              class="btn btn-success btn-sm ms-3 d-lg-none d-md-block"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#MobileMenu"
            >
              <i class="icon-menu"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
