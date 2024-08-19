import { useContext, useEffect } from "react";
import { PostContext } from "../../context/PostContext";
import { UserContext } from "../../context/UserContext";
import { useSearchParams } from "react-router-dom";
import CreatePost from "./CreatePost";
import PostStatusTab from "./PostStatusTab";
import { Spinner } from "react-bootstrap";
import PostList from "./PostList";
import Header from "../Header";
import Footer from "../Footer";
import "../../assets/css/Forum.css";

export default function Forum() {
  const { loading, posts, getAllPost, getPostByStatus, getSavedPost } =
    useContext(PostContext);
  const { user } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const statusQueryParam = searchParams.get("status");
  const statusList = [
    {
      id: 1,
      title: "Tất cả bài viết",
    },
    {
      id: 2,
      name: "Đã duyệt",
      title: "Bài viết của tôi",
    },
    {
      id: 3,
      name: "Chờ duyệt",
      title: "Chờ phê duyệt",
    },
    {
      id: 4,
      name: "Từ chối",
      title: "Bị từ chối",
    },
    {
      id: 5,
      name: "Đã lưu",
      title: "Đã lưu",
    },
  ];

  //get post list
  useEffect(() => {
    if (statusQueryParam) {
      if (statusQueryParam === "Đã lưu") getSavedPost(user.accountId);
      else getPostByStatus(statusQueryParam, user.accountId);
    } else getAllPost();
  }, [statusQueryParam, user.accountId]);

  return (
    <>
      <Header />
      <div className="body-forum">
        <div className="container">
          <CreatePost />
          <div className="post-filter-container">
            {user && <PostStatusTab statusList={statusList} />}
          </div>
          <div className="post-container">
            {loading ? <Spinner /> : <PostList posts={posts} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
