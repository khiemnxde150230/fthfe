import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Header from '../../component/Admin/Header';
import Navbar from '../../component/Admin/Navbar';
import { GetAllPostAdmin, ChangeStatusPost } from '../../services/ForumService';
import moment from 'moment';
import styles from '../../assets/css/ForumAdmin.module.css';
import { useToast } from '../../context/ToastContext';

const ForumAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [postToChange, setPostToChange] = useState(null);
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetAllPostAdmin();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching post data:', error);
        showErrorToast('Error fetching post data');
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment.utc(dateString).local().format('DD/MM/YYYY HH:mm');
  };

  const filteredPosts = posts.filter((post) => {
    if (filterStatus !== 'All' && post.status !== filterStatus) {
      return false;
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        post.postText.toLowerCase().includes(lowerSearchTerm) ||
        post.fullName.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return true;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleStatusChange = (postId, newStatus) => {
    setPostToChange({ postId, newStatus });
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!postToChange) return;

    try {
      const response = await ChangeStatusPost(
        postToChange.postId,
        postToChange.newStatus
      );

      if (response && response.status === 200) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postToChange.postId
              ? { ...post, status: postToChange.newStatus }
              : post
          )
        );
        showSuccessToast(response.message || 'Cập nhật trạng thái thành công');
      } else {
        console.error('Unexpected response:', response);
        showErrorToast(
          'Có lỗi xảy ra khi cập nhật trạng thái bài viết. Vui lòng thử lại.'
        );
      }
    } catch (error) {
      console.error('Error changing post status:', error);
      showErrorToast(
        'Có lỗi xảy ra khi cập nhật trạng thái bài viết. Chi tiết: ' +
          (error.message || 'Không có thông tin chi tiết')
      );
    }

    setShowModal(false);
    setPostToChange(null);
  };

  const handleApprove = (postId) => {
    handleStatusChange(postId, 'Đã duyệt');
  };

  const handleReject = (postId) => {
    handleStatusChange(postId, 'Chưa duyệt');
  };

  return (
    <div className={styles.forumAdminWrapper}>
      <div className={styles.forumAdminContainer}>
        <div className="app-header d-flex align-items-center">
          <Header />
        </div>

        <Navbar />

        <main className={styles.forumAdminMain}>
          <div>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <i className="icon-home lh-1"></i>
                <a href="/admin/dashboard" className="text-decoration-none">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item text-light">Forum</li>
            </ol>
          </div>
          <div className={styles.forumAdminControls}>
            <div className={styles.forumAdminFilters}>
              <button
                className={`${styles.filterBtn} ${
                  filterStatus === 'All' ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('All')}
              >
                All
              </button>
              <button
                className={`${styles.filterBtn} ${
                  filterStatus === 'Đã duyệt' ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('Đã duyệt')}
              >
                Đã duyệt
              </button>
              <button
                className={`${styles.filterBtn} ${
                  filterStatus === 'Chưa duyệt' ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('Chưa duyệt')}
              >
                Chưa duyệt
              </button>
            </div>
            <div className={styles.forumAdminSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className={styles.forumAdminPosts}>
            {currentPosts.map((post) => (
              <div key={post.postId} className={styles.forumPostCard}>
                <div className={styles.postHeader}>
                  <div className={styles.avatar}>
                    <img src={post.avatar || ''} alt="User avatar" />
                  </div>
                  <h3>
                    {post.fullName} •<span>{formatDate(post.createDate)}</span>
                  </h3>
                  <div className={styles.event}>{post.status}</div>
                </div>
                <div className={styles.content}>{post.postText}</div>
                <div>
                  {post.postFile && (
                    <img
                      src={post.postFile}
                      alt="ContentIMG"
                      className={styles.contentImg}
                      width="1000"
                      height="300"
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>
                <div className={styles.postActions}>
                  {post.status === 'Chưa duyệt' && (
                    <button
                      className={styles.approveBtn}
                      onClick={() => handleApprove(post.postId)}
                    >
                      Duyệt
                    </button>
                  )}
                  {post.status === 'Đã duyệt' && (
                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleReject(post.postId)}
                    >
                      Ẩn
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.forumAdminPagination}>
            {[
              ...Array(Math.ceil(filteredPosts.length / postsPerPage)).keys(),
            ].map((number) => (
              <button
                key={number}
                className={`${styles.pageBtn} ${
                  currentPage === number + 1 ? styles.active : ''
                }`}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </main>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thay đổi trạng thái</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {postToChange && postToChange.newStatus === 'Đã duyệt'
            ? 'Bạn muốn duyệt bài viết này không ?'
            : 'Bạn có muốn ẩn bài viết này không?'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Không
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ForumAdmin;
