import { Avatar, Form, Input, Modal, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { PostContext } from "../../context/PostContext";
import { UserContext } from "../../context/UserContext";
import { storage } from "../../firebase";

const defaultAvatar = "../avatar.png";

export default function CreatePost() {
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState({
    postText: "",
    postFile: "",
  });
  const [imageUpload, setImageUpload] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { addPost, getPostByStatus } = useContext(PostContext);
  const { user } = useContext(UserContext);
  const { accountId } = user;
  const imageUrlRef = useRef("");

  let imageUrlUpload = "";
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const showModal = () => {
    if (!user) {
      setOpenLogin(true);
    } else {
      setOpen(true);
    }
  };

  const cancelModal = () => {
    if (!user) {
      setOpenLogin(false);
    } else {
      setOpen(false);
    }
    form.resetFields();
  };
  const uploadImage = async () => {
    if (imageUpload == null) return;
    setUploadingImage(true);
    const imageRef = ref(storage, `forum_images/${imageUpload.name + v4()}`);
    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      imageUrlRef.current = url;
      imageUrlUpload = imageUrlRef.current;
      setUploadingImage(false);
      return imageUrlUpload;
    } catch (error) {
      console.log(error);
      setUploadingImage(false);
    }
  };

  //Display notification
  const [api, contextHolder] = notification.useNotification();
  const openNotificationAddPostSuccess = (placement) => {
    api.success({
      message: "Thông báo",
      description: "Bài viết của bạn đang chờ được phê duyệt !",
      placement,
    });
  };

  const handleSubmitAddPostForm = async () => {
    const postFile = await uploadImage();
    await addPost({ ...formValue, accountId, postFile });
    openNotificationAddPostSuccess("topRight");
    await getPostByStatus("Chờ duyệt", accountId);
    cancelModal();
    navigate("/forum?status=Chờ duyệt");
  };

  return (
    <>
      {contextHolder}
      <div className="createPost" type="primary">
        <div className="form">
          <Input
            onClick={showModal}
            size="large"
            placeholder="Bạn đang nghĩ gì thế?"
            prefix={
              user && <Avatar src={user.avatar ? user.avatar : defaultAvatar} />
            }
          />
          <hr></hr>
          {/* <div className="bottom-form">
              <div className="item-bottom-form">
                <img src={anh}></img>
                <label>Ảnh/Video</label>
              </div>
              <div className="item-bottom-form">
                <img src={tag}></img>
                <label>Tag</label>
              </div>
              <div className="item-bottom-form">
                <img src={monhoc}></img>
                <label>Môn học</label>
              </div>
            </div> */}
        </div>

        <Modal
          title="Tạo bài viết"
          open={open}
          okText={uploadingImage ? <Spinner /> : "Đăng bài"}
          cancelText="Đóng"
          onCancel={cancelModal}
          onOk={form.submit}
          okButtonProps={uploadingImage && { style: { pointerEvents: "none" } }}
        >
          <Form
            form={form}
            layout="horizontal"
            initialValues={formValue}
            onFinish={handleSubmitAddPostForm}
          >
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nội dung!",
                },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Bạn đang nghĩ gì thế?"
                onChange={(e) =>
                  setFormValue({ ...formValue, postText: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item
              label="Ảnh/Video"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              style={{
                marginTop: 10,
              }}
              className="form-item upload-image"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageUpload(event.target.files[0])}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Tạo bài viết"
          open={openLogin}
          okText="Đồng ý"
          cancelText="Hủy bỏ"
          onCancel={cancelModal}
          onOk={() => navigate("/login")}
        >
          <h5>Vui lòng đăng nhập để đăng bài viết !</h5>
        </Modal>
      </div>
    </>
  );
}
