import React, { useEffect, useState } from 'react';
import Header from '../../component/Admin/Header';
import Navbar from '../../component/Admin/Navbar';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import {
  getMonthlyRevenue,
  getActiveAccount,
  getTopRatedEvents,
  getTopParticipants,
  getTopRevenueEvents,
  getTopParticipantsEvents,
  generateEventStatisticsReport,
} from '../../services/StatisticService';
import '../../assets/css/dashboard.css';
import Footer from '../../component/Footer';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement
);

const Dashboard = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [topRatedEvents, setTopRatedEvents] = useState([]);
  const [topParticipants, setTopParticipants] = useState([]);
  const [topRevenueEvents, setTopRevenueEvents] = useState([]);
  const [topParticipantsEvents, setTopParticipantsEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          revenueResult,
          activeUsersResult,
          ratedEventsResult,
          topParticipantsResult,
          revenueEventsResult,
          participantsEventsResult,
        ] = await Promise.all([
          getMonthlyRevenue(),
          getActiveAccount(),
          getTopRatedEvents(),
          getTopParticipants(),
          getTopRevenueEvents(),
          getTopParticipantsEvents(),
        ]);

        setMonthlyRevenue(revenueResult);
        setActiveUsers(activeUsersResult);
        setTopRatedEvents(ratedEventsResult);
        setTopParticipants(topParticipantsResult);
        setTopRevenueEvents(revenueEventsResult);
        setTopParticipantsEvents(participantsEventsResult);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Định dạng dữ liệu cho biểu đồ doanh thu hàng tháng
  const formatMonthlyRevenueData = (data) => {
    const labels = data.map((item) => `${item.year}-${item.month}`);
    const values = data.map((item) => item.totalRevenue);

    return {
      labels,
      datasets: [
        {
          label: 'Monthly Revenue',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ],
    };
  };

  // Định dạng dữ liệu cho biểu đồ người tham gia
  const formatTopParticipantsData = (data) => {
    const labels = data.map((item) => `${item.accountName}`);
    const values = data.map((item) => item.eventsParticipated);

    return {
      labels,
      datasets: [
        {
          label: 'Events Participated',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Định dạng dữ liệu cho biểu đồ người dùng hoạt động
  const formatActiveUsersData = (data) => {
    const labels = data
      .filter((item) => item.year && item.month)
      .map((item) => `${item.year}-${item.month}`);
    const values = data
      .filter((item) => item.year && item.month)
      .map((item) => item.totalRegisteredUsers);

    return {
      labels,
      datasets: [
        {
          label: 'Active Users',
          data: values,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const formatTopEventsData = (data, valueKey, labelKey) => {
    const labels = data.map((item) => item[labelKey]);
    const values = data.map((item) => item[valueKey]);

    return {
      labels,
      datasets: [
        {
          label: valueKey,
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const topParticipantsData = formatTopParticipantsData(topParticipants);
  const activeUsersData = formatActiveUsersData(activeUsers);
  const revenueData = formatMonthlyRevenueData(monthlyRevenue);
  const topRevenueEventsData = formatTopEventsData(
    topRevenueEvents,
    'totalRevenue',
    'eventName'
  );
  const topParticipantsEventsData = formatTopEventsData(
    topParticipantsEvents,
    'participantsCount',
    'eventName'
  );

  const handleDownloadReport = async () => {
    try {
      const response = await generateEventStatisticsReport();
      const url = window.URL.createObjectURL(
        new Blob([response], { type: 'application/pdf' })
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'StatisticsReport.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download report', error);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
        ))}
        {halfStar && <i className="bi bi-star-half text-warning"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-warning"></i>
        ))}
      </>
    );
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
    },
  };

  return (
    <div>
      <div className="app-container">
        <div className="app-header d-flex align-items-center">
          <Header />
        </div>
        <Navbar />
        <div className="dashboard-container">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header1 revenue-header">
                <h5 className="card-title1">Monthly Revenue</h5>
              </div>
              <div className="card-body1">
                {loading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <Line data={revenueData} options={chartOptions} />
                )}
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-header1 active-users-header">
                <h5 className="card-title1">Active Users</h5>
              </div>
              <div className="card-body1">
                {loading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <Line data={activeUsersData} options={chartOptions} />
                )}
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-header1 top-participants-header">
                <h5 className="card-title1">Top Participants</h5>
              </div>
              <div className="card-body1">
                {loading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <Pie data={topParticipantsData} options={chartOptions} />
                )}
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-header1 rating-header">
                <h5 className="card-title1">Top Rated Events</h5>
              </div>
              <div className="card-body1">
                {loading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <ul className="event-list">
                    {topRatedEvents
                      .sort((a, b) => b.averageRating - a.averageRating)
                      .slice(0, 5)
                      .map((event, index) => (
                        <li key={index} className="event-item">
                          <span className="event-name">{event.eventName}</span>
                          <span className="event-rating">
                            {renderStars(event.averageRating)}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-header1 revenue-events-header">
                <h5 className="card-title1">Top Revenue Events</h5>
              </div>
              <div className="card-body1">
                {loading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <Bar data={topRevenueEventsData} options={chartOptions} />
                )}
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-header1 participants-events-header">
                <h5 className="card-title1">Top Participants Events</h5>
              </div>
              <div className="card-body1">
                {loading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <Bar
                    data={topParticipantsEventsData}
                    options={chartOptions}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="download-section">
            <button className="download-button" onClick={handleDownloadReport}>
              <i className="bi bi-file-earmark-pdf"></i> Download Report
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
