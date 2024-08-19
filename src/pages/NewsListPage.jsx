import React, { useState, useEffect } from "react";
import "../assets/css/NewsListPage.css";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { useNavigate } from "react-router-dom";
import { GetAllNewsService } from "../services/NewsService";

const NewsListPage = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      const response = await GetAllNewsService();
      if (response) {
        setNewsList(response);
      } else {
        console.error("Failed to fetch news:", response);
      }
    };

    fetchNews();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReadMore = (id) => {
    navigate(`/newsdetail/${id}`);
  };

  return (
    <div>
      <Header />
      <div className="news-list-container">
        <h1 className="news-list-title">Tin mới nhất</h1>
        <div className="news-list">
          {currentItems.map((item) => (
            <div key={item.newsId} className="news-item">
              <img
                src={item.coverImage}
                alt={item.title}
                className="news-image"
              />
              <div className="news-content">
                <h2 className="news-title">{item.title}</h2>
                <div className="news-summary-container">
                  <p className="news-summary">{item.subtitle}</p>
                </div>
                <div className="news-link-container">
                  <button
                    onClick={() => handleReadMore(item.newsId)}
                    className="news-link"
                  >
                    Đọc thêm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`page-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewsListPage;
