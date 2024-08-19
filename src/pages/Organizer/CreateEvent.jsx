import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Form, Input, Button, DatePicker, Select, Table, Upload, message, Modal, Switch } from 'antd';
import { UserContext } from '../../context/UserContext';
import { AddEventService } from '../../services/EventService';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';
import { v4 } from "uuid";
import { toast } from "react-toastify";
import { InboxOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LocationPicker from '../../component/LocationPicker';
import styled from "styled-components";
import Navbar from '../../component/Organizer/Navbar';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';


const { Dragger } = Upload;
const { Option } = Select;
const { Column } = Table;

// custom upload image ckeditor
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const imgRef = ref(storage, `images/event_images/description_images/${v4()}`);
    const snapshot = await uploadBytes(imgRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { default: url };
  }
  abort() { }
}

// setup custom upload ckeditor
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const CustomButton = styled(Button)`
  background-color: #EC6C21;
  border-color: #EC6C21;

  &:hover {
    background-color: #81360b !important;
    border-color: #81360b !important;
  }
`;

const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: #EC6C21;
  }
  &:hover.ant-switch-checked:not(.ant-switch-disabled) {
    background-color: #b74f18;
  }
  &:hover:not(.ant-switch-disabled) {
    background-color: #d85a1a;
  }
  .ant-switch-inner {
    font-size: 16px;
  }
  &.ant-switch {
    width: 90px;
    height: 22px;
  }
`;

const CreateEvent = () => {
  const { user } = useContext(UserContext);
  const [showNoteModal, setShowNoteModal] = useState(true);
  const navigate = useNavigate();

  const handleClickAgree = () => {
    setShowNoteModal(false);
  };

  const [formData, setFormData] = useState({
    accountId: user?.accountId || '',
    categoryId: '',
    eventName: '',
    themeImage: '',
    eventDescription: '',
    address: '',
    location: '',
    startTime: '',
    endTime: '',
    //ticketQuantity: 0,
    status: '',
    //eventImages: [],
    ticketTypes: [],
    // discountCodes: []
  });

  const now = moment();
  const startOfDay = now.clone().startOf('day');
  const startTime = formData.startTime ? moment(formData.startTime) : null;

  useEffect(() => {
    if (user?.accountId) {
      setFormData(prevFormData => ({
        ...prevFormData,
        accountId: user.accountId
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleCKEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      eventDescription: data
    });
  };

  const handleAddressChange = ({ provinceName, districtName, wardName, details }) => {
    const address = `${details}, ${wardName}, ${districtName}, ${provinceName}`;
    setFormData(prevFormData => ({
      ...prevFormData,
      address: address
    }));
  };

  const handleInputImage = async (file) => {
    const imgRef = ref(storage, `images/event_images/theme_images${v4()}`);
    try {
      const snapshot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prevState => ({
        ...prevState,
        themeImage: url
      }));
      toast.success('Ảnh đã được tải lên thành công!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Lỗi khi tải lên ảnh!');
    }
  };

  // const calculateTotalTicketQuantity = (ticketTypes) => {
  //   return ticketTypes.reduce((total, ticket) => total + Number(ticket.quantity), 0);
  // };

  const handleAddTicketType = () => {
    setFormData(prevState => {
      const newTicketTypes = [...prevState.ticketTypes];
      const existingNames = new Set(newTicketTypes.map(tt => tt.typeName.trim().toLowerCase()));

      if (!existingNames.has("")) {
        newTicketTypes.push({ typeName: '', price: 0, quantity: 0, status: '' });
      } else {
        toast.error('Tên loại vé không được để trống hoặc trùng lặp!');
      }

      return {
        ...prevState,
        ticketTypes: newTicketTypes,
      };
    });
  };

  // const handleAddDiscountCode = () => {
  //   setFormData(prevState => ({
  //     ...prevState,
  //     discountCodes: [...prevState.discountCodes, { code: '', discountAmount: 0, quantity: 0, status: '' }]
  //   }));
  // };

  const handleTicketTypeChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const updatedTicketTypes = [...prevState.ticketTypes];

      if (name === 'typeName' && value.trim() !== '') {
        const isDuplicate = updatedTicketTypes.some((ticket, i) =>
          ticket.typeName.trim().toLowerCase() === value.trim().toLowerCase() && i !== index
        );
        if (isDuplicate) {
          toast.error('Tên loại vé đã tồn tại!');
          return prevState;
        }
      }

      if (name === 'price' && value < 0) {
        toast.error('Giá tiền không hợp lệ!');
        return prevState;
      }
      if (name === 'quantity' && value < 0) {
        toast.error('Số lượng không hợp lệ!');
        return prevState;
      }

      updatedTicketTypes[index][name] = value;
      return {
        ...prevState,
        ticketTypes: updatedTicketTypes
      };
    });
  };

  // const handleDiscountCodeChange = (index, e) => {
  //   const { name, value } = e.target;
  //   setFormData(prevState => {
  //     const updatedDiscountCodes = [...prevState.discountCodes];
  //     if ((name === 'discountAmount' || name === 'quantity') && value < 0) {
  //       message.error(`${name === 'discountAmount' ? 'Giá trị giảm giá' : 'Số lượng'} không hợp lệ!`);
  //       return prevState;
  //     }
  //     updatedDiscountCodes[index][name] = value;
  //     return {
  //       ...prevState,
  //       discountCodes: updatedDiscountCodes,
  //     };
  //   });
  // };

  const handleRemoveTicketType = (index) => {
    setFormData(prevState => {
      const updatedTicketTypes = prevState.ticketTypes.filter((_, i) => i !== index);
      //const newTicketQuantity = calculateTotalTicketQuantity(updatedTicketTypes);
      return {
        ...prevState,
        ticketTypes: updatedTicketTypes,
        //ticketQuantity: newTicketQuantity
      };
    });
  };

  const handleRemoveDiscountCode = (index) => {
    const updatedDiscountCodes = formData.discountCodes.filter((_, i) => i !== index);
    setFormData(prevState => ({ ...prevState, discountCodes: updatedDiscountCodes }));
  };

  const handleSubmit = async () => {
    try {
      //to utc time
      const startTimeUTC = formData.startTime ? moment(formData.startTime).utc().toISOString() : null;
      const endTimeUTC = formData.endTime ? moment(formData.endTime).utc().toISOString() : null;
  
      const dataToSubmit = {
        ...formData,
        startTime: startTimeUTC,
        endTime: endTimeUTC,
      };
  
      const response = await AddEventService(dataToSubmit);
      if (response.status === 200) {
        toast.success('Sự kiện đã được tạo thành công!');
        navigate('/organizer/events');
      } else if (response.status === 400 && response.message === "Tickettype is required") {
        toast.error('Vui lòng nhập loại vé!');
      } else if (response.status === 400 && response.message === "Description is required") {
        toast.error('Vui lòng nhập mô tả!');
      }
       else if (response.status === 400 && response.message === "Add Event Fail") {
        toast.error('Có lỗi xảy ra, vui lòng thử lại!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi tạo sự kiện!');
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
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        // message.success(`${info.file.name} file uploaded successfully.`);
        console.log(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        //message.error(`${info.file.name} file upload failed.`);
        console.log(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleDateChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value ? value.toISOString() : null,
    }));
  };

  const handleResizeObserverError = useCallback((e) => {
    e.preventDefault();
    console.warn('ResizeObserver loop limit exceeded');
  }, []);

  useEffect(() => {
    window.addEventListener('error', handleResizeObserverError);
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, [handleResizeObserverError]);

  return (
    <>
      <Navbar />
      <div className="bg bg-light">
        <div className="bg bg-light">
          {showNoteModal ? null : (
            <Form onFinish={handleSubmit} layout="vertical" className='p-4'>
              <h2>Thông tin sự kiện <i class="bi bi-calendar-event"></i></h2>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <Form.Item name="themeImage" label="Thêm ảnh nền sự kiện" rules={[{ required: true, message: 'Vui lòng thêm ảnh nền sự kiện!' }]}>
                    <Dragger {...uploadProps}>
                      {formData.themeImage ? (
                        <img
                          src={formData.themeImage}
                          alt="Event Theme"
                          style={{ width: '100%', cursor: 'pointer' }}
                        />
                      ) : (
                        <>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ color: '#EC6C21' }} />
                          </p>
                          <p className="ant-upload-text">Ảnh nền sự kiện</p>
                          <p className="ant-upload-hint">Kích thước 1280x720</p>
                        </>
                      )}
                    </Dragger>
                  </Form.Item>
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Item name="eventName" label="Tên sự kiện" rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}>
                    <Input
                      showCount
                      placeholder="Tên sự kiện"
                      maxLength={80}
                      onChange={handleChange}
                      id="eventName"
                    />
                  </Form.Item>
                  <Form.Item name="location" label="Tên địa điểm" rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm!' }]}>
                    <Input
                      showCount
                      placeholder="Tên địa điểm"
                      maxLength={80}
                      onChange={handleChange}
                      id="location"
                    />
                  </Form.Item>
                  <Form.Item name="address" label="Địa chỉ">
                    <LocationPicker onLocationChange={handleAddressChange} />
                  </Form.Item>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <Form.Item
                    name="startTime"
                    label="Thời gian bắt đầu"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu!' }]}
                  >
                    <DatePicker
                      showTime
                      disabledDate={(current) => current && current < startOfDay}
                      // disabledTime={() => ({
                      //   disabledHours: () => now.hour() < 23 ? [...Array(now.hour()).keys()] : [],
                      //   disabledMinutes: () => now.hour() === now.hour() && now.minute() > 0 ? [...Array(now.minute()).keys()] : [],
                      // })}
                      onChange={(value) => {
                        handleDateChange('startTime', value);
                        if (value && formData.endTime && value.isAfter(formData.endTime)) {
                          setFormData(prevState => ({
                            ...prevState,
                            endTime: null
                          }));
                        }
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 mb-3">
                  {/* <Form.Item name="endTime" label="Thời gian kết thúc" rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc!' }]}>
                    <DatePicker
                      showTime
                      onChange={(value) =>
                        setFormData({ ...formData, endTime: value })
                      }
                    />
                  </Form.Item> */}
                  <Form.Item
                    name="endTime"
                    label="Thời gian kết thúc"
                    rules={[
                      { required: true, message: 'Vui lòng chọn thời gian kết thúc!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const startTime = getFieldValue('startTime');
                          if (!value || (startTime && value.isAfter(startTime))) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      showTime
                      disabledDate={(current) => {
                        const startTime = formData.startTime ? moment(formData.startTime) : null;
                        return current && startTime && current.isBefore(startTime, 'day');
                      }}
                      disabledTime={() => {
                        const startTime = formData.startTime ? moment(formData.startTime) : null;
                        if (!startTime) return {};

                        const startHour = startTime.hour();
                        const startMinute = startTime.minute();

                        return {
                          disabledHours: () => (startHour > 0 ? [...Array(startHour).keys()] : []),
                          disabledMinutes: () => (startHour === startTime.hour() ? [...Array(startMinute).keys()] : []),
                        };
                      }}
                      onChange={(value) => handleDateChange('endTime', value)}
                    />
                  </Form.Item>

                </div>
              </div>
              <Form.Item name="categoryId" label="Thể loại sự kiện" rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}>
                <Select
                  placeholder="Chọn loại sự kiện"
                  onChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <Option value="1">Nghệ thuật</Option>
                  <Option value="2">Giáo dục</Option>
                  <Option value="3">Thể thao</Option>
                  <Option value="4">Sự kiện khác</Option>
                </Select>
              </Form.Item>
              <Form.Item name="eventDescription" label="Mô tả sự kiện" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                <CKEditor
                  editor={ClassicEditor}
                  data={formData.eventDescription}
                  onChange={handleCKEditorChange}
                  config={{
                    extraPlugins: [CustomUploadAdapterPlugin],
                    toolbar: [
                      'heading', '|',
                      'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                      'alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify', '|',
                      'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
                      'undo', 'redo', '|',
                      'imageUpload', 'mediaEmbed'
                    ]
                  }}
                />
              </Form.Item>
              <h3>Loại vé <span onClick={handleAddTicketType} style={{ cursor: 'pointer' }}><i class="bi bi-plus-circle"></i></span></h3>
              <Table
                dataSource={formData.ticketTypes}
                pagination={false}
                rowKey={(record, index) => index}
              >
                <Column
                  title="Tên loại vé"
                  dataIndex="typeName"
                  key="typeName"
                  render={(text, record, index) => (
                    <Input
                      showCount
                      maxLength={20}
                      placeholder="Tên loại vé"
                      value={text}
                      name="typeName"
                      onChange={(e) => handleTicketTypeChange(index, e)}
                    />
                  )}
                />
                <Column
                  title="Giá"
                  dataIndex="price"
                  key="price"
                  render={(text, record, index) => (
                    <Input
                      addonAfter="₫"
                      type="number"
                      placeholder="Giá vé"
                      value={text}
                      name="price"
                      onChange={(e) => handleTicketTypeChange(index, e)}
                    />
                  )}
                />
                <Column
                  title="Số lượng"
                  dataIndex="quantity"
                  key="quantity"
                  render={(text, record, index) => (
                    <Input
                      type="number"
                      placeholder="Số lượng"
                      value={text}
                      name="quantity"
                      onChange={(e) => handleTicketTypeChange(index, e)}
                      rules={[
                        { required: true, message: 'Vui lòng nhập số lượng!' },
                        {
                          pattern: /^[1-9]\d*$/,
                          message: 'Số lượng lớn hơn 0!',
                        },
                      ]}
                    />
                  )}
                />
                <Column
                  title="Hành động"
                  key="action"
                  render={(text, record, index) => (
                    <Button
                      type="danger"
                      onClick={() => handleRemoveTicketType(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  )}
                />
              </Table>
              {/* <CustomButton type="primary" onClick={handleAddTicketType}>
          Thêm loại vé
        </CustomButton> */}
              {/* <h3 className='mt-3'>Mã giảm giá <span onClick={handleAddDiscountCode} style={{ cursor: 'pointer' }}><i class="bi bi-plus-circle"></i></span></h3>
              <Table
                dataSource={formData.discountCodes}
                pagination={false}
                rowKey={(record, index) => index}
              >
                <Column
                  title="Mã giảm giá"
                  dataIndex="code"
                  key="code"
                  render={(text, record, index) => (
                    <Input
                      showCount
                      maxLength={20}
                      placeholder="Mã giảm giá"
                      value={text}
                      name="code"
                      onChange={(e) => handleDiscountCodeChange(index, e)}
                    />
                  )}
                />
                <Column
                  title="Giá trị giảm giá"
                  dataIndex="discountAmount"
                  key="discountAmount"
                  render={(text, record, index) => (
                    <Input
                      addonAfter="%"
                      type="number"
                      placeholder="Giá trị giảm giá"
                      value={text}
                      name="discountAmount"
                      onChange={(e) => handleDiscountCodeChange(index, e)}
                    />
                  )}
                />
                <Column
                  title="Số lượng"
                  dataIndex="quantity"
                  key="quantity"
                  render={(text, record, index) => (
                    <Input
                      type="number"
                      placeholder="Số lượng"
                      value={text}
                      name="quantity"
                      onChange={(e) => handleDiscountCodeChange(index, e)}
                    />
                  )}
                />
                <Column
                  title="Hành động"
                  key="action"
                  render={(text, record, index) => (
                    <Button
                      type="danger"
                      onClick={() => handleRemoveDiscountCode(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  )}
                />
              </Table> */}
              {/* <CustomButton type="primary" onClick={handleAddDiscountCode}>
          Thêm mã giảm giá
        </CustomButton> */}
              {/* <Form.Item name="status" label="Trạng thái" className='mt-3' rules={[{ required: true, message: 'Vui lòng chọn!' }]}>
                <Select
                  placeholder="Vui lòng chọn"
                  onChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <Option value="Nháp">Lưu nháp</Option>
                  <Option value="Chờ duyệt">Gửi xét duyệt</Option>
                </Select>
              </Form.Item> */}
              <Form.Item name="status" label="Trạng thái" className='mt-3'>
                <CustomSwitch
                  checkedChildren="Chờ duyệt"
                  unCheckedChildren="Nháp"
                  onChange={(checked) => setFormData({ ...formData, status: checked ? "Chờ duyệt" : "Nháp" })}
                />
              </Form.Item>

              <Form.Item className="mt-4 pb-4">
                <CustomButton type="primary" htmlType="submit">
                  Tạo sự kiện
                </CustomButton>
              </Form.Item>
            </Form>
          )}
          <Modal
            title="Lưu ý"
            open={showNoteModal}
            onOk={handleClickAgree}
            closable={false}
            footer={[
              <CustomButton key="submit" type="primary" onClick={handleClickAgree}>
                Tôi đã hiểu
              </CustomButton>,
            ]}
          >
            <p>1. Đảm bảo rằng thông tin sự kiện là chính xác và đầy đủ.</p>
            <p>2. Với các ban tổ chức: Trong trường hợp ban tổ chức đăng tải sự kiện với thông tin không đầy đủ hoặc có những nội dung không phù hợp, chúng tôi có quyền gỡ bỏ sự kiện khỏi nền tảng mà không cần thông báo.</p>
            <p>3. Với người dùng đã trở thành ban tổ chức: Sau khi được duyệt 1 sự kiện và trở thành ban tổ chức, đảm bảo rằng bạn cập nhật các thông tin trong hồ sơ chính xác để hiển thị trong thông tin sự kiện. Các thông tin mới cần cập nhật gồm: Logo ban tổ chức, Tên ban tổ chức, Ngày thành lập.</p>
            <p>4. Chúng tôi sẽ liên tục kiểm tra thông tin của các sự kiện đang được hiển thị trên nền tảng, nếu có sai phạm liên quan đến hình ảnh hoặc nội dung, chúng tôi sẽ thực hiện gỡ bỏ sự kiện và khóa tài khoản của ban tổ chức.</p>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
