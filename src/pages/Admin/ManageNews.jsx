import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Pagination, Table, notification } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Admin/Header';
import Navbar from '../../component/Admin/Navbar';
import { UserContext } from '../../context/UserContext';
import {
  ChangeStatusNewsService,
  GetAllNewsAdminService,
} from '../../services/NewsService';

export default function ManageNews() {
  const { user, render, onSetRender } = useContext(UserContext);
  const [newsData, setNewsData] = useState([]);
  const [filteredNewsData, setFilteredNewsData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchAllNews = async (status = '') => {
    const result = await GetAllNewsAdminService(status);
    if (result) {
      setNewsData(result);
      setFilteredNewsData(result);
      console.log(result);
    }
  };

  useEffect(() => {
    fetchAllNews(filterStatus);
  }, [render, filterStatus]);

  const handleChangeStatusActivate = async (record) => {
    Modal.confirm({
      title: 'Bạn muốn duyệt bài viết này?',
      okText: 'Đồng ý',
      okType: 'default',
      cancelText: 'Thoát',
      onOk: async () => {
        const status = 'Đã duyệt';
        const result = await ChangeStatusNewsService(record.newsId, status);
        if (result.status === 200) {
          openNotificationEnable('topRight');
        }
        onSetRender();
      },
    });
  };

  const handleChangeStatusDeActivate = async (record) => {
    Modal.confirm({
      title: 'Bạn muốn hủy duyệt bài viết này?',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Thoát',
      onOk: async () => {
        const status = 'Chưa duyệt';
        const result = await ChangeStatusNewsService(record.newsId, status);
        if (result.status === 200) {
          openNotificationEnable('topRight');
        }
        onSetRender();
      },
    });
  };

  const openNotificationEnable = (placement) => {
    notification.success({
      message: 'Thành công',
      description: 'Thao tác thành công',
      placement,
    });
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAndSearchedNews = filteredNewsData.filter((news) =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredAndSearchedNews.slice(
    indexOfFirstNews,
    indexOfLastNews
  );

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a
          href={`/admin/news/news-detail/${record.newsId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span style={{ color: text === 'Đã duyệt' ? 'green' : 'red' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <span>
          {record.status === 'Đã duyệt' ? (
            <Button
              icon={<MinusCircleOutlined />}
              onClick={() => handleChangeStatusDeActivate(record)}
              style={{ marginRight: 8 }}
            >
              Hủy duyệt
            </Button>
          ) : (
            <Button
              icon={<CheckCircleOutlined />}
              onClick={() => handleChangeStatusActivate(record)}
              style={{ marginRight: 8 }}
            >
              Duyệt
            </Button>
          )}
        </span>
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
                      <li className="breadcrumb-item text-light">
                        Manage News
                      </li>
                    </ol>
                  </div>
                  <div className="d-flex">
                    <div className="btn-group me-3">
                      <button
                        className={`btn ${
                          filterStatus === ''
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleFilterChange('')}
                      >
                        Tất cả
                      </button>
                      <button
                        className={`btn ${
                          filterStatus === 'Đã duyệt'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleFilterChange('Đã duyệt')}
                      >
                        Đã duyệt
                      </button>
                      <button
                        className={`btn ${
                          filterStatus === 'Chờ duyệt'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleFilterChange('Chờ duyệt')}
                      >
                        Chờ duyệt
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
                      <Table
                        columns={columns}
                        dataSource={currentNews}
                        rowKey="newsId"
                        pagination={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <Pagination
                  current={currentPage}
                  total={filteredAndSearchedNews.length}
                  pageSize={newsPerPage}
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
