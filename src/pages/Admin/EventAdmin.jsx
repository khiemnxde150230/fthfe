import '../../assets/fonts/icomoon/style.css';
import '../../assets/css/main.css';
import '../../assets/vendor/overlay-scroll/OverlayScrollbars.min.css';
import '../../assets/images/favicon.svg';
import Header from '../../component/Admin/Header';
import Navbar from '../../component/Admin/Navbar';
import React, { useState, useEffect } from 'react';
import ChangeStatusButton from '../../component/Admin/ChangeStatusButton';
import '../../assets/css/Event.css';
import { GetEventsForAdminService } from '../../services/EventService';
import moment from 'moment';
import { useToast } from '../../context/ToastContext';
import {
  GetRateByEventIdService,
  UpdateRatingStatusService,
  DeleteRatingService,
} from '../../services/EventRatingService';

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const { showSuccessToast, showErrorToast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [eventRatings, setEventRatings] = useState([]);
  const [ratingCurrentPage, setRatingCurrentPage] = useState(1);
  const [ratingFilterStatus, setRatingFilterStatus] = useState('All');
  const [ratingSearchTerm, setRatingSearchTerm] = useState('');
  const ratingsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetEventsForAdminService();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching event data:', error);
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

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleEventClick = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return moment.utc(dateString).local().format('DD/MM/YYYY HH:mm');
  };

  const handleChangeEventStatus = async (eventId, newStatus) => {
    try {
      const updatedEvents = events.map((event) =>
        event.eventId === eventId ? { ...event, status: newStatus } : event
      );
      setEvents(updatedEvents);

      showSuccessToast(`Thay đổi trạng thái thành ${newStatus} thành công`);
    } catch (error) {
      console.error('Error changing event status:', error);
      showErrorToast('Failed to change event status');
    }
  };
  useEffect(() => {
    if (currentEvent && activeTab === 'ratings') {
      fetchRatingsByEventId(currentEvent.eventId);
    }
  }, [currentEvent, activeTab]);

  const fetchRatingsByEventId = async (eventId) => {
    try {
      const response = await GetRateByEventIdService(eventId);
      setEventRatings(response.ratings || []);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setEventRatings([]);
    }
  };

  const handleRatingStatusChange = async (ratingId, newStatus) => {
    try {
      await UpdateRatingStatusService(ratingId, newStatus);
      fetchRatingsByEventId(currentEvent.eventId);
      showSuccessToast('Thay đổi trạng thái đánh giá thành công');
    } catch (error) {
      console.error('Error updating rating status:', error);
      showErrorToast('Failed to update rating status');
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (window.confirm('Bạn có muốn xóa đánh giá này?')) {
      try {
        await DeleteRatingService(ratingId);
        fetchRatingsByEventId(currentEvent.eventId);
        showSuccessToast('Xóa đánh giá thành công');
      } catch (error) {
        console.error('Error deleting rating:', error);
        showErrorToast('Failed to delete rating');
      }
    }
  };

  const filteredRatings = eventRatings.filter((rating) => {
    return (
      (ratingFilterStatus === 'All' ||
        rating.status.trim() === ratingFilterStatus) &&
      (rating.accountName
        .toLowerCase()
        .includes(ratingSearchTerm.toLowerCase()) ||
        rating.review.toLowerCase().includes(ratingSearchTerm.toLowerCase()))
    );
  });

  const filteredEvents = events.filter((event) => {
    if (filterStatus !== 'All' && event.status !== filterStatus) {
      return false;
    }
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        event.eventName.toLowerCase().includes(searchTermLower) ||
        event.fullName.toLowerCase().includes(searchTermLower) ||
        event.categoryName.toLowerCase().includes(searchTermLower) ||
        event.location.toLowerCase().includes(searchTermLower)
      );
    }
    return true;
  });
  const indexOfLastRating = ratingCurrentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = filteredRatings.slice(
    indexOfFirstRating,
    indexOfLastRating
  );
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents
    .slice(indexOfFirstEvent, indexOfLastEvent)
    .map((event, index) => ({
      ...event,
      index: indexOfFirstEvent + index + 1,
    }));

  const columns = [
    { title: 'ID', dataIndex: 'index', key: 'index' },
    { title: 'Tên Sự kiện', dataIndex: 'eventName', key: 'eventName' },
    { title: 'Ban tổ chức', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Thể loại', dataIndex: 'categoryName', key: 'categoryName' },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text, event) => formatDate(event.startTime),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text, event) => formatDate(event.endTime),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, event) => (
        <div className="button-container">
          <button
            onClick={() => handleEventClick(event)}
            className="btn-tooltip btn btn-outline-primary btn-sm"
            title="Chi tiết"
            style={{ marginRight: '10px' }}
          >
            <i className="icon-eye"></i>
          </button>
          <ChangeStatusButton
            eventId={event.eventId}
            currentStatus={event.status}
            onStatusChange={(newStatus) =>
              handleChangeEventStatus(event.eventId, newStatus)
            }
            onSuccess={(newStatus) =>
              showSuccessToast(
                `Event status changed to ${newStatus} successfully`
              )
            }
            onError={() => showErrorToast('Failed to change event status')}
          />
        </div>
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
                      <li className="breadcrumb-item text-light">Event</li>
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
                      <table className="table table-bordered table-striped align-middle m-0">
                        <thead>
                          <tr>
                            {columns.map((column) => (
                              <th key={column.key}>{column.title}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentEvents.map((event) => (
                            <tr key={event.eventId}>
                              {columns.map((column) => (
                                <td key={column.key}>
                                  {column.render
                                    ? column.render(null, event)
                                    : column.dataIndex === 'startTime' ||
                                      column.dataIndex === 'endTime'
                                    ? formatDate(event[column.dataIndex])
                                    : event[column.dataIndex]}
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
                        Math.ceil(filteredEvents.length / eventsPerPage)
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
                        Math.ceil(filteredEvents.length / eventsPerPage)
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

      {showModal && currentEvent && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{currentEvent.eventName}</h2>
              <button
                type="button"
                className="close-btn"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <ul className="nav nav-tabs1">
                <li className="nav-item1">
                  <button
                    className={`nav-link1 ${
                      activeTab === 'details' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                  </button>
                </li>
                <li className="nav-item1">
                  <button
                    className={`nav-link1 ${
                      activeTab === 'ratings' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('ratings')}
                  >
                    Ratings
                  </button>
                </li>
              </ul>
              {activeTab === 'details' && (
                <>
                  <div className="event-info1">
                    <div className="event-image1">
                      <img
                        src={currentEvent.themeImage}
                        alt={`Event picture of ${currentEvent.eventName}`}
                      />
                    </div>
                    <div className="event-details">
                      <p>
                        <strong>Organizer:</strong> {currentEvent.fullName}
                      </p>
                      <p>
                        <strong>Category:</strong> {currentEvent.categoryName}
                      </p>
                      <p>
                        <strong>Location:</strong> {currentEvent.location}
                      </p>
                      <p>
                        <strong>Address:</strong> {currentEvent.address}
                      </p>
                      <p>
                        <strong>Start Time:</strong>{' '}
                        {formatDate(currentEvent.startTime)}
                      </p>
                      <p>
                        <strong>End Time:</strong>{' '}
                        {formatDate(currentEvent.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="event-description">
                    <h3>Description</h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentEvent.eventDescription,
                      }}
                    />
                  </div>

                  <div className="ticket-types">
                    <h3>Ticket Types</h3>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Price</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEvent.tickettypes.map((ticketType) => (
                          <tr key={ticketType.ticketTypeId}>
                            <td>{ticketType.typeName}</td>
                            <td>{ticketType.price} VNĐ</td>
                            <td>{ticketType.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {activeTab === 'ratings' && (
                <div className="ratings-tab">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="btn-group">
                      <button
                        className={`btn ${
                          ratingFilterStatus === 'All'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => setRatingFilterStatus('All')}
                      >
                        All
                      </button>
                      <button
                        className={`btn ${
                          ratingFilterStatus === 'Active'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => setRatingFilterStatus('Active')}
                      >
                        Active
                      </button>
                      <button
                        className={`btn ${
                          ratingFilterStatus === 'Pending'
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => setRatingFilterStatus('Pending')}
                      >
                        Pending
                      </button>
                    </div>
                    <div className="search-bar">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm..."
                        value={ratingSearchTerm}
                        onChange={(e) => setRatingSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRatings.map((rating) => (
                        <tr key={rating.eventRatingId}>
                          <td>{rating.accountName}</td>
                          <td>
                            {rating.rating}
                            <i className="icon-star1"></i>
                          </td>
                          <td>{rating.review}</td>
                          <td>{formatDate(rating.ratingDate)}</td>
                          <td>
                            <select
                              value={rating.status.trim()}
                              onChange={(e) =>
                                handleRatingStatusChange(
                                  rating.eventRatingId,
                                  e.target.value
                                )
                              }
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                handleDeleteRating(rating.eventRatingId)
                              }
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="d-flex justify-content-center">
                    <nav>
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            ratingCurrentPage === 1 ? 'disabled' : ''
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              setRatingCurrentPage(ratingCurrentPage - 1)
                            }
                          >
                            Previous
                          </button>
                        </li>
                        {[
                          ...Array(
                            Math.ceil(filteredRatings.length / ratingsPerPage)
                          ).keys(),
                        ].map((number) => (
                          <li
                            key={number}
                            className={`page-item ${
                              ratingCurrentPage === number + 1 ? 'active' : ''
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setRatingCurrentPage(number + 1)}
                            >
                              {number + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            ratingCurrentPage ===
                            Math.ceil(filteredRatings.length / ratingsPerPage)
                              ? 'disabled'
                              : ''
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              setRatingCurrentPage(ratingCurrentPage + 1)
                            }
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAdmin;
