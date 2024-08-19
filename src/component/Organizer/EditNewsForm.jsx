import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
import { UserContext } from '../../context/UserContext';
import { InboxOutlined } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { v4 } from 'uuid';
import { toast } from 'react-toastify';
import { GetNewsForEdit, UpdateNewsService } from '../../services/NewsService';
import { useNavigate } from 'react-router-dom';

// Custom styled components
const CustomButton = styled(Button)`
  background-color: #EC6C21;
  border-color: #EC6C21;

  &:hover {
    background-color: #81360b !important;
    border-color: #81360b !important;
  }
`;

const { Dragger } = Upload;

// Custom upload image adapter for CKEditor
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const imgRef = ref(storage, `images/news_images/content_images/${v4()}`);
    const snapshot = await uploadBytes(imgRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { default: url };
  }
  abort() { }
}

// Setup custom upload for CKEditor
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const EditNewsForm = ({ newsId }) => {
  const { user } = useContext(UserContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newsId: '',
    title: '',
    subtitle: '',
    content: '',
    coverImage: '',
    createDate: '',
    status: ''
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await GetNewsForEdit(newsId);
        if (response) {
          setFormData(response);
          form.setFieldsValue({
            title: response.title,
            subtitle: response.subtitle,
            content: response.content,
            coverImage: response.coverImage
          });
        } else {
          toast.error('Không tìm thấy tin tức!');
        }
      } catch (error) {
        console.error(error);
        toast.error('Lỗi khi tải tin tức!');
      }
    };

    fetchNews();
  }, [newsId, form]);

  const handleCKEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData(prevState => ({
      ...prevState,
      content: data
    }));
  };

  const handleInputImage = async (file) => {
    const imgRef = ref(storage, `images/news_images/cover_images/${v4()}`);
    try {
      const snapshot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prevState => ({
        ...prevState,
        coverImage: url
      }));
      toast.success('Ảnh đã được tải lên thành công!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Lỗi khi tải lên ảnh!');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await UpdateNewsService(formData);
      if (response.status === 200) {
        toast.success('Tin tức đã được cập nhật thành công!');
        navigate("/organizer/manage-news");
      } else {
        toast.error('Cập nhật tin tức thất bại!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật tin tức!');
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            if (img.width === 1280 && img.height === 720) {
              resolve();
            } else {
              toast.error('Kích thước ảnh phải là 1280x720!');
              reject(new Error('Kích thước ảnh không hợp lệ'));
            }
          };
        };
      });
    },
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        handleInputImage(file);
        onSuccess("ok");
      }, 0);
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item name="coverImage" label="Ảnh bìa">
        <Dragger {...uploadProps}>
          {formData.coverImage ? (
            <img
              src={formData.coverImage}
              alt="Cover"
              style={{ width: '100%', cursor: 'pointer' }}
            />
          ) : (
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#EC6C21' }} />
              </p>
              <p className="ant-upload-text">Ảnh bìa tin tức</p>
              <p className="ant-upload-hint">Kéo hoặc thả ảnh vào đây</p>
            </>
          )}
        </Dragger>
      </Form.Item>
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
        <Input 
          name="title" 
          value={formData.title} 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
        />
      </Form.Item>
      <Form.Item name="subtitle" label="Tiêu đề phụ" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề phụ!' }]}>
        <Input 
          name="subtitle" 
          value={formData.subtitle} 
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
        />
      </Form.Item>
      <Form.Item name="content" label="Nội dung bài viết" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
        <CKEditor
          editor={ClassicEditor}
          data={formData.content}
          onChange={handleCKEditorChange}
          config={{
            extraPlugins: [CustomUploadAdapterPlugin],
            toolbar: [
              'heading', '|',
              'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
              'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
              'undo', 'redo', '|',
              'imageUpload', 'mediaEmbed'
            ]
          }}
        />
      </Form.Item>
      <Form.Item>
        <CustomButton type="primary" htmlType="submit">
          Cập nhật
        </CustomButton>
      </Form.Item>
    </Form>
  );
};

export default EditNewsForm;