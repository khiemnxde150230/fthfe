import { useContext, useState } from "react";
import { PostContext } from "../../context/PostContext";
import { CommentContext } from "../../context/CommentContext";
import { UserContext } from "../../context/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Avatar, Modal, notification } from "antd";
import PostDetails from "./PostDetails";
import CommentList from "./CommentList";
import moment from "moment/moment";

const defaultAvatar = "../avatar.png";
const like = "../like.png";
const liked = "../liked.png";
const save = "../save.png";
const saved = "../saved.png";
const comment = "../comment.png";

export default function PostContent({ post }) {
  const {
    postId,
    avatar,
    fullName,
    createDate,
    postText,
    postFile,
    status,
    postlikes,
    postfavorites,
    countComment,
    countLike,
  } = post;

  const {
    getAllPost,
    currentPost,
    getPostById,
    getPostByStatus,
    likePost,
    unlikePost,
    savePost,
    unSavePost,
    getSavedPost,
  } = useContext(PostContext);

  const { comments, getCommentsByPost } = useContext(CommentContext);
  const { user } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const statusQueryParams = searchParams.get("status");
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [messageModal, setMessageModal] = useState("");

  const userLiked = postlikes?.find(
    (like) => like.accountId === user.accountId
  );
  const userSaved = postfavorites?.find(
    (postfavourite) => postfavourite.accountId === user.accountId
  );

  const showModal = (postId) => {
    setIsModalOpen(true);
    getPostById(postId);
    getCommentsByPost(postId);
  };

  const cancelModal = () => {
    setIsModalOpen(false);
  };

  const showLoginModal = () => {
    setIsLoginOpen(true);
  };

  const cancelLoginModal = () => {
    setIsLoginOpen(false);
  };

  const formattedCreateDate = moment
    .utc(createDate)
    .local()
    .format("DD/MM/YYYY HH:mm");

  //Display notification
  const [api, contextHolder] = notification.useNotification();
  const openNotificationSavePostSuccess = (placement) => {
    api.success({
      message: "Thông báo",
      description: "Lưu bài viết thành công !",
      placement,
    });
  };

  const openNotificationUnSavePostSuccess = (placement) => {
    api.success({
      message: "Thông báo",
      description: "Bỏ lưu bài viết thành công !",
      placement,
    });
  };
  const handleLikedClick = async () => {
    if (user) {
      if (!userLiked) {
        await likePost(postId, user.accountId);
      } else {
        await unlikePost(postId, user.accountId);
      }

      if (statusQueryParams) {
        if (statusQueryParams === "Đã lưu") {
          await getSavedPost(user.accountId);
        } else {
          await getPostByStatus(statusQueryParams, user.accountId);
        }
      } else {
        await getAllPost();
      }
    } else {
      showLoginModal();
      setMessageModal("like");
    }
  };

  const handleSaveClick = async () => {
    if (user) {
      if (!userSaved) {
        await savePost(postId, user.accountId);
        openNotificationSavePostSuccess("topRight");
      } else {
        await unSavePost(postId, user.accountId);
        openNotificationUnSavePostSuccess("topRight");
      }

      if (statusQueryParams) {
        if (statusQueryParams === "Đã lưu") {
          await getSavedPost(user.accountId);
        } else {
          await getPostByStatus(statusQueryParams, user.accountId);
        }
      } else {
        await getAllPost();
      }
    } else {
      showLoginModal();
      setMessageModal("lưu");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="form-info">
        <div className="form-left">
          <Avatar
            src={
              <img
                src={!avatar ? defaultAvatar : avatar}
                alt="avatar"
                className="avatar"
              />
            }
          />
        </div>
        <div className="form-mid">
          <div className="form-mid-top">
            <div>
              {fullName} • {formattedCreateDate}
            </div>
          </div>
          <div className="form-mid-content">
            <div>
              <p>{postText}</p>
            </div>
            {postFile && <img src={postFile} alt="post"></img>}
          </div>
        </div>
        <div className="form-right">
          <img
            src={userSaved ? saved : save}
            onClick={handleSaveClick}
            alt="save"
          ></img>
        </div>
      </div>
      {status === "Đã duyệt" && (
        <div className="form-like">
          <img
            onClick={handleLikedClick}
            src={userLiked ? liked : like}
            alt="like"
          />
          <p className="countLikeAndComment">{countLike}</p>
          <img src={comment} onClick={() => showModal(postId)} alt="comment" />
          <p className="countLikeAndComment">{countComment}</p>
        </div>
      )}

      <Modal
        title={`Bài viết của ${fullName}`}
        cancelText="Đóng"
        okButtonProps={{ style: { display: "none" } }}
        open={isModalOpen}
        onCancel={cancelModal}
        className="comment-modal"
      >
        <PostDetails data={currentPost} />
        {comments.length > 0 ? (
          <>
            <h6 className="comment-title">Bình luận</h6>
            <CommentList comments={comments} />
          </>
        ) : (
          <h6 className="comment-title-empty"> Chưa có bình luận nào !</h6>
        )}
      </Modal>

      <Modal
        title={`${
          messageModal.charAt(0).toUpperCase() + messageModal.slice(1)
        } bài viết`}
        open={isLoginOpen}
        okText="Đồng ý"
        cancelText="Hủy bỏ"
        onCancel={cancelLoginModal}
        onOk={() => navigate("/login")}
      >
        <h5>Vui lòng đăng nhập để {messageModal} bài viết !</h5>
      </Modal>
    </>
  );
}
