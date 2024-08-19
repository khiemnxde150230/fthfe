import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Navbar from "../../component/Organizer/Navbar";
import { UserContext } from '../../context/UserContext';
import { Input, Segmented, Table, Button, Card, Avatar, Col, Row, message, Modal, Form } from 'antd';
import { GetUpcomingEventsByOrganizerService, GetStaffByEventService, AddStaffByEmail, DeleteStaffService } from '../../services/EventStaffService';
import { CloseOutlined, UserAddOutlined } from '@ant-design/icons';
import Footer from '../../component/Footer';
import { toast } from 'react-toastify';
import moment from 'moment';

const { Meta } = Card;

const CustomSearch = styled(Input)`
  .ant-btn-primary {
    background-color: #EC6C21;
    border-color: #EC6C21;

    &:hover, 
    &:focus {
      background-color: #EC6C21 !important;
      border-color: #EC6C21 !important;
      opacity: 0.8;
    }
  }
`;

const CustomButton = styled(Button)`
  background-color: #EC6C21;
  border-color: #EC6C21;

  &:hover {
    background-color: #81360b !important;
    border-color: #81360b !important;
  }
`;

const CustomSegmented = styled(Segmented)`
  .ant-segmented-item {
    &:hover {
      opacity: 0.8;
      color: white;
    }
    &.ant-segmented-item-selected {
      background-color: #EC6C21;
      color: white;
    }
  }
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  border-color: red;
  color: white;

  &:hover {
    background-color: darkred;
    border-color: darkred;
  }
`;

const ManageStaff = () => {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('TẤT CẢ');
  const [search, setSearch] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [staffData, setStaffData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [email, setEmail] = useState('');

  const showAddStaffModal = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEmail('');
  };

  const handleAddStaff = async () => {
    if (!email) {
      toast.error('Nhập email!');
      return;
    }
    try {
      const response = await AddStaffByEmail(email, selectedEvent.eventId);
      if (response.status === 200) {
        toast.success('Thêm thành công!');
        setIsModalVisible(false);
        setEmail('');
        const updatedStaff = await fetchStaffData(selectedEvent.eventId);
        setStaffData(prevState => ({ ...prevState, [selectedEvent.eventId]: updatedStaff }));
      } else if (response.status === 400 && response.message === 'User not found') {
        toast.error('Người dùng không tồn tại!');
      } else if (response.status === 400 && response.message === 'Unable to add') {
        toast.error('Tài khoản không hợp lệ!');
      } else if (response.status === 400 && response.message === 'Staff already added for this event') {
        toast.error('Đã được thêm!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
    }
  };



  useEffect(() => {
    const fetchEvents = async () => {
      if (!user.accountId) {
        console.error('accountId', user.accountId);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await GetUpcomingEventsByOrganizerService(user.accountId);
        console.log('response', response);

        if (!Array.isArray(response)) {
          console.error('response is not an array', response);
          setEvents([]);
          setFilteredEvents([]);
        } else {
          setEvents(response);
          setFilteredEvents(response);
        }
      } catch (error) {
        console.error("fetching data error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user.accountId, staffData]);

  useEffect(() => {
    filterEvents(filter, search);
  }, [events, filter, search]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterEvents(filter, value);
  };

  const handleSegmentedChange = (value) => {
    setFilter(value);
    filterEvents(value, search);
  };

  const filterEvents = (filter, search) => {
    let filtered = events;
    if (search) {
      filtered = filtered.filter(event => event.eventName.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredEvents(filtered);
  };

  const formatDateTime = (dateString) => {
    return moment.utc(dateString).local().format('DD/MM/YYYY HH:mm');
  };

  const columns = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => formatDateTime(text),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text) => formatDateTime(text),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Số nhân viên',
      dataIndex: 'numberOfStaff',
      key: 'numberOfStaff',
    },
    {
      title: 'Thêm',
      key: 'actions',
      render: (_, record) => (
        <CustomButton type="primary" onClick={() => showAddStaffModal(record)}>
          <UserAddOutlined />
        </CustomButton>
      ),
    },
  ];

  const fetchStaffData = async (eventId) => {
    try {
      const response = await GetStaffByEventService(eventId);
      return response.result;
    } catch (error) {
      console.error("fetching staff data error", error);
      return [];
    }
  };

  const handleExpand = async (expanded, record) => {
    if (expanded) {
      const staff = await fetchStaffData(record.eventId);
      setStaffData(prevState => ({ ...prevState, [record.eventId]: staff }));
      setExpandedRowKeys(prevState => [...prevState, record.eventId]);
    } else {
      setExpandedRowKeys(prevState => prevState.filter(key => key !== record.eventId));
    }
  };

  const handleDelete = async (staffId, eventId) => {
    try {
      await DeleteStaffService(staffId, eventId);
      toast.success('Đã xóa!');
      const updatedStaff = staffData[eventId].filter(staff => staff.accountId !== staffId);
      setStaffData(prevState => ({ ...prevState, [eventId]: updatedStaff }));
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
      console.error("delete staff error", error);
    }
  };

  const expandedRowRender = (record) => {
    const staff = staffData[record.eventId] || [];
    return (
      <Row gutter={16}>
        {staff.map((staffMember) => (
          <Col span={8} key={staffMember.accountId}>
            <Card>
              <Meta
                avatar={<Avatar src={staffMember.avatar} />}
                title={staffMember.fullName}
                description={
                  <>
                    <p>Email: {staffMember.email}</p>
                    <p>Số điện thoại: {staffMember.phone}</p>
                  </>
                }
              />
              <DeleteButton
                icon={<CloseOutlined />}
                onClick={() => handleDelete(staffMember.accountId, record.eventId)}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-4 bg-light">
        <div className="row align-items-center mb-4">
          <div className="col-md-8 mb-3 mb-md-0">
            <CustomSearch
              placeholder="Tìm kiếm sự kiện"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey="eventId"
          loading={loading}
          pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15']}}
          expandable={{
            expandedRowRender,
            onExpand: handleExpand,
            expandedRowKeys,
            rowExpandable: (record) => record.numberOfStaff > 0
          }}
        />
      </div>
      <Modal
        title={`Thêm soát vé viên cho ${selectedEvent?.eventName}`}
        open={isModalVisible}
        // onOk={handleAddStaff}
        onCancel={handleCancel}
        footer={[
          <CustomButton key="submit" type="primary" onClick={handleAddStaff}>
            Thêm
          </CustomButton>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Email" name="email" rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}>
            <Input
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Footer />
    </>
  );
};

export default ManageStaff;
