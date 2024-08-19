import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Form, Input, Button, DatePicker, Select, Table, Upload, message, Modal, Row, Col, Switch } from 'antd';
import { UserContext } from '../../context/UserContext';
import { AddEventService, GetEventForEdit, GetTicketTypeByEventService, UpdateEventService, UpdateTicketQuantityService } from '../../services/EventService';
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
import Footer from '../../component/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { decodeId } from '../../utils/utils';
import moment from 'moment/moment';
import CustomCKEditor from '../../component/CustomCKEditor';

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

const EditEvent = () => {
  const { user } = useContext(UserContext);
  const { encodedId } = useParams();
  const [eventId, setEventId] = useState(decodeId(encodedId));
  //const eventId = decodeId(encodedId);
  //const [render, setRender] = useState('');
  const navigate = useNavigate();
  //const {currentAccountId} = useState(user?.accountId);
  //const MemoizedCKEditor = React.memo(CKEditor);
  // const [showNoteModal, setShowNoteModal] = useState(true);
  const [formData, setFormData] = useState({
    eventId: '',
    accountId: '',
    categoryId: '',
    eventName: '',
    themeImage: '',
    eventDescription: '',
    address: '',
    location: '',
    startTime: null,
    endTime: null,
    //ticketQuantity: 0,
    status: '',
    eventImages: [],
    ticketTypes: [],
    discountCodes: []
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(null);
  const [addQuantity, setAddQuantity] = useState(0);
  const [ticketTypes, setTicketTypes] = useState([]);

  const HandleGetEventForEdit = async () => {
    const response = await GetEventForEdit(eventId);
    if (response.accountId !== user?.accountId) {
      toast.error('Không có quyền truy cập!')
      navigate('/organizer/events');
    }
    if (response) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...response,
        startTime: response.startTime ? moment.utc(response.startTime).local() : null,
        endTime: response.endTime ? moment.utc(response.endTime).local() : null,
      }));
    }
  };

  const HandleGetTicketType = async () => {
    const response = await GetTicketTypeByEventService(eventId);
    try {
      if (response) {
        setTicketTypes(response.result || []);
      }
    }
    catch (e) {
      console.error('error', e);
    }
  };



  useEffect(() => {
    if (!user.accountId) {
      console.error('accountid', user.accountId);
      //setLoading(false);
      return;
    }
    try {
      HandleGetEventForEdit();
      HandleGetTicketType();
    }
    catch (e) {
      console.error('error', e);
    }

  }, [user.accountId]);


  useEffect(() => {
    console.log('response', formData);
  }, [formData]);


  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  }, []);

  const handleDateChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value ? value.toISOString() : null,
    }));
  };



  const handleCKEditorChange = useCallback((event, editor) => {
    const data = editor.getData();
    setFormData((prevFormData) => ({
      ...prevFormData,
      eventDescription: data,
    }));
  }, []);


  // const handleAddressChange = ({ provinceName, districtName, wardName, details }) => {
  //   const address = `${details}, ${wardName}, ${districtName}, ${provinceName}`;
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     address: address
  //   }));
  // };

  const handleInputImage = async (file) => {
    const imgRef = ref(storage, `images/event_images/theme_images${v4()}`);
    try {
      const snapshot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prevState => ({
        ...prevState,
        themeImage: url
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading image!');
    }
  };

  // const calculateTotalTicketQuantity = (ticketTypes) => {
  //   return ticketTypes.reduce((total, ticket) => total + Number(ticket.quantity), 0);
  // };

  // const handleAddTicketType = () => {
  //   setFormData(prevState => {
  //     const newTicketTypes = [...prevState.ticketTypes, { typeName: '', price: 0, quantity: 0, status: '' }];
  //     //const newTicketQuantity = calculateTotalTicketQuantity(newTicketTypes);
  //     return {
  //       ...prevState,
  //       ticketTypes: newTicketTypes,
  //       //ticketQuantity: newTicketQuantity
  //     };
  //   });
  // };

  // const handleAddDiscountCode = () => {
  //   setFormData(prevState => ({
  //     ...prevState,
  //     discountCodes: [...prevState.discountCodes, { code: '', discountAmount: 0, quantity: 0, status: '' }]
  //   }));
  // };

  // const handleTicketTypeChange = (index, e) => {
  //   const { name, value } = e.target;
  //   setFormData(prevState => {
  //     const updatedTicketTypes = [...prevState.ticketTypes];
  //     if (name === 'price' && value < 0) {
  //       message.error('Invalid price!');
  //       return prevState;
  //     }
  //     if (name === 'quantity' && value <= 0) {
  //       message.error('Invalid quantity!');
  //       return prevState;
  //     }
  //     updatedTicketTypes[index][name] = value;
  //     //const newTicketQuantity = calculateTotalTicketQuantity(updatedTicketTypes);
  //     return {
  //       ...prevState,
  //       ticketTypes: updatedTicketTypes,
  //       //ticketQuantity: newTicketQuantity
  //     };
  //   });
  // };

  // const handleDiscountCodeChange = (index, e) => {
  //   const { name, value } = e.target;
  //   setFormData(prevState => {
  //     const updatedDiscountCodes = [...prevState.discountCodes];
  //     if ((name === 'discountAmount' || name === 'quantity') && value < 0) {
  //       message.error(`${name === 'discountAmount' ? 'Invalid discount amount' : 'Invalid quantity'}`);
  //       return prevState;
  //     }
  //     updatedDiscountCodes[index][name] = value;
  //     return {
  //       ...prevState,
  //       discountCodes: updatedDiscountCodes,
  //     };
  //   });
  // };

  // const handleRemoveTicketType = (index) => {
  //   setFormData(prevState => {
  //     const updatedTicketTypes = prevState.ticketTypes.filter((_, i) => i !== index);
  //     //const newTicketQuantity = calculateTotalTicketQuantity(updatedTicketTypes);
  //     return {
  //       ...prevState,
  //       ticketTypes: updatedTicketTypes,
  //       //ticketQuantity: newTicketQuantity
  //     };
  //   });
  // };

  // const handleRemoveDiscountCode = (index) => {
  //   const updatedDiscountCodes = formData.discountCodes.filter((_, i) => i !== index);
  //   setFormData(prevState => ({ ...prevState, discountCodes: updatedDiscountCodes }));
  // };
  const showAddQuantityModal = (ticketTypeId) => {
    setSelectedTicketTypeId(ticketTypeId);
    setAddQuantity(0); // Reset the quantity input
    setIsModalVisible(true);
  };


  const handleSubmit = async () => {
    try {
      const startTime = formData.startTime ? moment(formData.startTime).utc().toISOString() : null;
      const endTime = formData.endTime ? moment(formData.endTime).utc().toISOString() : null;

      const eventData = {
        ...formData,
        startTime,
        endTime,
      };

      const response = await UpdateEventService(eventData);
      if (response.status === 200) {
        toast.success('Chỉnh sửa thành công!');
        navigate('/organizer/events');
      } else if (response.status === 400) {
        toast.error('Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating the event!');
    }
  };




  const handleAddQuantity = async () => {
    if (isNaN(addQuantity) || addQuantity <= 0) {
      message.error("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    try {
      const response = await UpdateTicketQuantityService(selectedTicketTypeId, addQuantity);
      if (response.result.result.status === 200) {
        toast.success("Đã cập nhật số lượng vé thành công!");
        setTicketTypes((prevTicketTypes) =>
          prevTicketTypes.map((ticket) =>
            ticket.ticketTypeId === selectedTicketTypeId
              ? { ...ticket, quantity: ticket.quantity + addQuantity }
              : ticket
          )
        );
        setIsModalVisible(false);
      } else {
        message.error("Có lỗi xảy ra khi cập nhật số lượng vé.");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while updating the ticket quantity.");
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
              message.error('Image size must be 1280x720!');
              reject(new Error('Invalid image size'));
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
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // const closeNoteModal = () => {
  //   setShowNoteModal(false);
  // };

  return (
    <div>
      <Navbar />
      <div className="bg bg-light">
        <div className="p-4">
          <Form layout="vertical">
            <h2>Chỉnh sửa sự kiện <i class="bi bi-calendar-event"></i></h2>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Ảnh nền sự kiện">
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
              </Col>
              <Col span={12}>
                <Form.Item label="Tên sự kiện">
                  <Input
                    id="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Nhập tên sự kiện"
                  />
                </Form.Item>
                <Form.Item label="Tên địa điểm">
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Nhập tên địa điểm"
                  />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Thời gian bắt đầu">
                  <DatePicker
                    showTime
                    value={formData.startTime ? moment(formData.startTime) : null}
                    onChange={(value) => handleDateChange('startTime', value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thời gian kết thúc">
                  <DatePicker
                    showTime
                    value={formData.endTime ? moment(formData.endTime) : null}
                    onChange={(value) => handleDateChange('endTime', value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Mô tả sự kiện">
              <CustomCKEditor
                value={formData.eventDescription}
                onChange={handleCKEditorChange}
              />
            </Form.Item>
            <Form.Item label="Các loại vé">
              <Table dataSource={ticketTypes} rowKey="ticketTypeId" pagination={false}>
                <Column title="Tên loại vé" dataIndex="typeName" key="typeName" />
                <Column title="Giá" dataIndex="price" key="price" render={(price) => `${price.toLocaleString()} VND`} />
                <Column title="Số lượng" dataIndex="quantity" key="quantity" />
                <Column
                  title="Hành động"
                  key="action"
                  render={(_, record) => (
                    <CustomButton
                      type="primary"
                      onClick={() => showAddQuantityModal(record.ticketTypeId)}
                    >
                      Thêm số lượng
                    </CustomButton>
                  )}
                />
              </Table>
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" className='mt-3'>
              {formData.status === 'Nháp' && (
                <CustomSwitch
                  checked={formData.status === 'Chờ duyệt'}
                  onChange={(checked) => setFormData({ ...formData, status: checked ? 'Chờ duyệt' : 'Nháp' })}
                  checkedChildren="Chờ duyệt"
                  unCheckedChildren="Nháp"
                />
              )}
              {formData.status === 'Chờ duyệt' && (
                <span>Chờ duyệt</span>
              )}
              {formData.status === 'Đã duyệt' && (
                <span>Đã duyệt</span>
              )}
            </Form.Item>
            <Form.Item>
              <CustomButton type="primary" onClick={handleSubmit}>
                Lưu thay đổi
              </CustomButton>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
      <Modal
        title="Thêm số lượng vé"
        open={isModalVisible}
        //onOk={handleAddQuantity}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <CustomButton key="submit" type="primary" onClick={handleAddQuantity}>
            Thêm
          </CustomButton>,
        ]}
      >
        <Input
          type="number"
          min={1}
          value={addQuantity}
          onChange={(e) => setAddQuantity(parseInt(e.target.value, 10))}
          placeholder="Nhập số lượng vé muốn thêm"
        />
      </Modal>

    </div>
  );
};

export default EditEvent;