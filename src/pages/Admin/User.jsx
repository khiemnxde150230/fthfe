import React, { useState, useEffect } from 'react';
import Header from '../../component/Admin/Header';
import Navbar from '../../component/Admin/Navbar';
import LockButton from '../../component/Admin/LockButton';
import EditButton from '../../component/Admin/EditButton';
import ConfirmButton from '../../component/Admin/ConfirmButton';
import '../../assets/css/editprofile.css';
import {
  GetAllUserAccountsService,
  ChangeStatusUserService,
  ChangeRoleService,
} from '../../services/UserService';
import { format } from 'date-fns';
import { Select } from 'antd';
import { useToast } from '../../context/ToastContext';

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetAllUserAccountsService();
        setUsers(data.userList);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showModal]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLockChange = async (id, newStatus) => {
    try {
      const status = newStatus ? 'Đang khóa' : 'Đang hoạt động';
      await ChangeStatusUserService(id, status);
      const updatedUsers = users.map((user) =>
        user.accountId === id
          ? {
              ...user,
              status: status,
            }
          : user
      );
      setUsers(updatedUsers);
      showSuccessToast(
        `User ${newStatus ? 'locked' : 'unlocked'} successfully`
      ); // Add this line
    } catch (error) {
      console.error('Error changing user status:', error);
      showErrorToast('Failed to change user status'); // Add this line
    }
  };

  const handleConfirmChange = async (accountId) => {
    try {
      await ChangeStatusUserService(accountId, 'Đang hoạt động');
      const updatedUsers = users.map((user) =>
        user.accountId === accountId
          ? { ...user, status: 'Đang hoạt động' }
          : user
      );
      setUsers(updatedUsers);
      showSuccessToast('User confirmed successfully'); // Add this line
    } catch (error) {
      console.error('Error approving user:', error);
      showErrorToast('Failed to confirm user'); // Add this line
    }
  };

  const handleChangeRole = async () => {
    try {
      const newRoleId = selectedRole;
      if (currentUser) {
        await ChangeRoleService(currentUser.accountId, newRoleId);
        const updatedUsers = users.map((user) =>
          user.accountId === currentUser.accountId
            ? { ...user, roleId: newRoleId }
            : user
        );
        setUsers(updatedUsers);
        setShowModal(false);
        setSelectedRole(null);
        showSuccessToast('User role changed successfully'); // Add this line
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      showErrorToast('Failed to change user role'); // Add this line
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleEditButtonClick = (user) => {
    setCurrentUser(user);
    setSelectedRole(user.roleId.toString());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const formattedDate = format(new Date(dateString), 'dd/MM/yyyy');
    return formattedDate;
  };

  const filteredUsers = users.filter((user) => {
    if (filterStatus !== 'All' && user.status !== filterStatus) {
      return false;
    }
    if (
      searchTerm &&
      !(
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers
    .slice(indexOfFirstUser, indexOfLastUser)
    .map((user, index) => ({
      ...user,
      index: indexOfFirstUser + index + 1,
    }));

  const columns = [
    { title: 'STT', dataIndex: 'index', key: 'index' },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (user) => (
        <>
          <img src={user.avatar} className="me-2 img-3x rounded-3" alt="avt" />
          {user.fullName}
        </>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDay',
      key: 'birthDay',
      render: (user) => formatDate(user.birthDay),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (user) => (
        <div className="d-flex align-items-center">
          <i
            className={`icon-circle1 me-2 fs-5 ${
              user.status === 'Chờ xác thực'
                ? 'text-danger'
                : user.status === 'Đang khóa'
                ? 'text-light'
                : 'text-success'
            }`}
          ></i>
          {user.status}
        </div>
      ),
    },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (user) => (
        <>
          {user.status === 'Đang hoạt động' || user.status === 'Đang khóa' ? (
            <>
              <EditButton onEdit={() => handleEditButtonClick(user)} />
              <LockButton
                isLocked={user.status === 'Đang khóa'}
                onLockChange={(newStatus) =>
                  handleLockChange(user.accountId, newStatus)
                }
              />
            </>
          ) : user.status === 'Chờ xác thực' ? (
            <>
              <ConfirmButton
                accountId={user.accountId}
                onConfirm={() => handleConfirmChange(user.accountId)}
              />
            </>
          ) : null}
        </>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div className="app-header d-flex align-items-center">
          <Header />
        </div>

        <Navbar />

        <div className="app-body">
          <div className="container">
            <div className="row">
              <div className="col-12 col-xl-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <i className="icon-home lh-1"></i>
                        <a
                          href="/admin/dashboard"
                          className="text-decoration-none"
                        >
                          Home
                        </a>
                      </li>
                      <li className="breadcrumb-item text-light">User</li>
                    </ol>
                  </div>
                  <div className="d-flex">
                    <div className="btn-group me-3">
                      <button
                        className={`btn ${
                          filterStatus === 'All'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleFilterChange('All')}
                      >
                        All
                      </button>
                      <button
                        className={`btn ${
                          filterStatus === 'Đang hoạt động'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleFilterChange('Đang hoạt động')}
                      >
                        Đang hoạt động
                      </button>
                      <button
                        className={`btn ${
                          filterStatus === 'Đang khóa'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleFilterChange('Đang khóa')}
                      >
                        Đang khóa
                      </button>
                      <button
                        className={`btn ${
                          filterStatus === 'Chờ xác thực'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleFilterChange('Chờ xác thực')}
                      >
                        Chờ xác thực
                      </button>
                    </div>
                    <div className="search-bar">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="card mb-2">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped align-middle m-0">
                        <thead>
                          <tr>
                            {columns.map((column) => (
                              <th key={column.key}>{column.title}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((user) => (
                            <tr key={user.accountId}>
                              {columns.map((column) => (
                                <td key={column.key}>
                                  {column.render
                                    ? column.render(user)
                                    : user[column.dataIndex]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <nav>
                  <ul
                    className="pagination"
                    role="navigation"
                    aria-label="Pagination"
                  >
                    <li
                      className={`page-item ${
                        currentPage === 1 ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                    </li>
                    {[
                      ...Array(
                        Math.ceil(filteredUsers.length / usersPerPage)
                      ).keys(),
                    ].map((number) => (
                      <li
                        key={number}
                        className={`page-item ${
                          currentPage === number + 1 ? 'active' : ''
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(number + 1)}
                        >
                          {number + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage ===
                        Math.ceil(filteredUsers.length / usersPerPage)
                          ? 'disabled'
                          : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && currentUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="main">
              <div className="row">
                <div className="col-sm-6 picture">
                  <center>
                    <img
                      className="circle responsive-img"
                      src={currentUser.avatar}
                      alt={`Profile picture of ${currentUser.fullName}`}
                    />
                    <span className="btn-tooltip" title="Add Friend"></span>
                  </center>
                </div>
                <div className="col-sm-6 details">
                  <center>
                    <p className="name">
                      <b>{currentUser.fullName}</b>
                    </p>
                  </center>
                  <center>
                    <p className="email">{currentUser.email}</p>
                  </center>
                  <center>
                    <p className="phone">{currentUser.phone}</p>
                  </center>
                </div>
              </div>

              <form>
                <div className="row">
                  <div className="col-sm-6">
                    <label htmlFor="gender">Gender:</label>
                    <p id="gender" className="form-control-static">
                      {currentUser.gender}
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="status">Status:</label>
                    <p id="status" className="form-control-static">
                      {currentUser.status}
                    </p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6">
                    <label htmlFor="birthday">Birthday:</label>
                    <p id="birthday" className="form-control-static">
                      {formatDate(currentUser.birthDay)}
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="role">Role:</label>
                    <Select
                      value={selectedRole}
                      onChange={(value) => setSelectedRole(value)}
                      style={{ width: '100%' }}
                    >
                      <Select.Option value="1">Admin</Select.Option>
                      <Select.Option value="2">User</Select.Option>
                      <Select.Option value="3">Organizer</Select.Option>
                      <Select.Option value="4">Staff</Select.Option>
                    </Select>
                  </div>
                </div>
                <div className="buttons-container mt-4">
                  <button
                    type="button"
                    className="waves-effect waves-light btn edit back-btn"
                    onClick={handleCloseModal}
                  >
                    Trở lại
                  </button>
                  <button
                    type="button"
                    className="waves-effect waves-light btn edit change-role-btn"
                    onClick={handleChangeRole}
                  >
                    Xác nhận
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
