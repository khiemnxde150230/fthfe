import { Button, Modal, notification } from "antd";
import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PostContext } from "../../context/PostContext";
import { UserContext } from "../../context/UserContext";
import PostContent from "./PostContent";
import SendComment from "./SendComment";

const PostList = ({ posts }) => {
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchParams] = useSearchParams();
  const statusQueryParams = searchParams.get("status");
  const { user } = useContext(UserContext);
  const { getAllPost, getPostByStatus, deletePost } = useContext(PostContext);

  const showModal = (post) => {
    setOpen(true);
    setSelectedPost(post);
  };

  const cancelModal = () => {
    setOpen(false);
  };

  //Display notification
  const [api, contextHolder] = notification.useNotification();

  const openNotificationDeletedPost = (placement) => {
    api.success({
      message: "Thông báo",
      description: "Bài viết đã được xóa thành công !",
      placement,
    });
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    if (statusQueryParams) {
      getPostByStatus(statusQueryParams, user.accountId);
    } else {
      getAllPost();
    }
    cancelModal();
    openNotificationDeletedPost("topRight");
  };

  return (
    <div className="post">
      {contextHolder}
      {posts?.length > 0 ? (
        posts.map((post) => (
          <div key={post.postId} className="form-post">
            <PostContent post={post} />
            {(!statusQueryParams ||
              (statusQueryParams === "Đã duyệt" && user.roleId !== 2) ||
              statusQueryParams === "Đã lưu") && (
              <>
                <SendComment post={post} />
              </>
            )}
            {!statusQueryParams && post.accountId === user.accountId && (
              <Button
                className="delete-post-btn"
                type="primary"
                danger
                onClick={() => showModal(post)}
              >
                Xóa bài
              </Button>
            )}
            {statusQueryParams === "Đã duyệt" && (
              <Button
                className="delete-post-btn"
                type="primary"
                danger
                onClick={() => showModal(post)}
              >
                Xóa bài
              </Button>
            )}
            {statusQueryParams === "Chờ duyệt" && user.roleId === 4 && (
              <Button
                className="delete-post-btn"
                type="primary"
                danger
                onClick={() => showModal(post)}
              >
                Xóa bài
              </Button>
            )}
            <Modal
              title="Xác nhận"
              open={open}
              okText="Đồng ý"
              cancelText="Hủy bỏ"
              onOk={() => handleDeletePost(selectedPost?.postId)}
              onCancel={cancelModal}
              className="confirm-delete-modal"
            >
              <h3>Bạn có đồng ý xóa bài viết này?</h3>
            </Modal>
          </div>
        ))
      ) : (
        <h3 className="post-empty">Không tìm thấy bài viết nào!</h3>
      )}
    </div>
  );
};

export default PostList;
