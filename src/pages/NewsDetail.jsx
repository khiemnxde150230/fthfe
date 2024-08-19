import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { GetNewsByIdUserService } from "../services/NewsService";
import moment from "moment/moment";

const NewsDetails = () => {
  const { newsId } = useParams();
  const [news, setNews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const response = await GetNewsByIdUserService(newsId);
      if (response.status === 404) {
        navigate("/404");
      } else {
        setNews(response);
      }
    };
    fetchNews();
  }, [newsId]);

  if (!news) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          &larr; Quay lại trang trước
        </button>
        <img
          src={news.coverImage}
          alt={news.title}
          style={styles.coverImage}
        />
        <p style={styles.createDate}>{moment.utc(news.createDate).local().format("DD/MM/YYYY HH:mm")}</p>
        <h1 style={styles.title}>{news.title}</h1>
        <h1 style={styles.subtitle}>{news.subtitle}</h1>
        <div style={styles.content} dangerouslySetInnerHTML={{ __html: news.content }} />
        <div style={styles.authorInfo}>
          <img src={news.avatar} alt={news.fullName} style={styles.avatar} />
          <p style={styles.authorName}>{news.fullName}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Arial', sans-serif",
  },
  backButton: {
    display: "inline-block",
    marginBottom: "20px",
    padding: "8px 16px",
    backgroundColor: "#EC6C21",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  coverImage: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  content: {
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  authorInfo: {
    display: "flex",
    alignItems: "center",
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid #ccc",
  },
  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "15px",
  },
  authorName: {
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default NewsDetails;
