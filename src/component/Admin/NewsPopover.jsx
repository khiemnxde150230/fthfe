import React from "react";
import { Popover } from "antd";
import "../../assets/css/NewsPopover.css";

const NewsPopover = ({ news }) => {
  const content = (
    <div className="news-popover-content">
      <img src={news.coverImage} alt="Cover" className="cover-image" />
      <p>
        <strong>Tác giả:</strong> {news.fullName}
      </p>
      <p>
        <strong>Ngày tạo:</strong>{" "}
        {new Date(news.createDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Trạng thái:</strong>{" "}
        {news.status === "1" ? "Đã duyệt" : "Chưa duyệt"}
      </p>
      <p>
        <strong>Nội dung:</strong>
        <div dangerouslySetInnerHTML={{ __html: news.content }} />
      </p>
    </div>
  );

  return (
    <Popover content={content} title={news.title} trigger="hover">
      <span className="news-title">{news.title}</span>
    </Popover>
  );
};

export default NewsPopover;
