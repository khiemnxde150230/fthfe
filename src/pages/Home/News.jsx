import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetLastestNewsService } from '../../services/NewsService';
import moment from 'moment';
import 'moment/locale/vi';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await GetLastestNewsService();
        if (response) {
          setNewsItems(response);
        }
      } catch (e) {
        setError('Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-white">Tin tức</h2>
      <div className="row">
        {newsItems.map((item) => (
          <div key={item.newsId} className="col-md-6 col-lg-3 mb-4">
            <Link to={`/newsdetail/${item.newsId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card h-60">
                <img
                  src={item.coverImage}
                  className="card-img-top"
                  style={{ height: "300px", objectFit: "cover" }}
                  alt={item.title}
                />
                <div className="card-body">
                  <p className="card-text">
                    {capitalizeFirstLetter(moment(item.createDate).locale('vi').format('dddd, DD/MM/YYYY'))}
                  </p>
                  <h5 className="card-title text-truncate" style={{ color: "white", maxWidth: "200px", marginBottom: "8px" }}>
                    {item.title}
                  </h5>
                  {item.subtitle && (
                    <h6 className="card-subtitle" style={{ color: "gray", maxWidth: "200px" }}>
                      {item.subtitle}
                    </h6>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;