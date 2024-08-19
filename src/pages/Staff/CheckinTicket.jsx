import React, { useState, useContext } from "react";
import { Switch, Input, Button, Modal, Spin, Form, Row, Col, Typography } from "antd";
import NavbarStaff from "../../component/Staff/NavbarStaff";
import QrScannerComponent from "../../component/Staff/QrScanner";
import styled from "styled-components";
import { CheckinTicketService, GetEventByStaffService } from "../../services/StaffService";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import moment from "moment/moment";

const { Title, Text } = Typography;

const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: #EC6C21;
  }
  &:hover.ant-switch-checked:not(.ant-switch-disabled) {
    background-color: #b74f18;
  }

  .ant-switch-inner {
    font-size: 16px;
  }
  &.ant-switch {
    width: 90px;
    height: 22px;
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

const CheckinTicket = () => {
  const { user } = useContext(UserContext);
  const [ticketId, setTicketId] = useState('');
  const [isQrScanner, setIsQrScanner] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketInfo, setTicketInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [showMyEventsModal, setShowMyEventsModal] = useState(false);

  const formatDateTime = (date) => {
    if (!date) return '';
    return moment.utc(date).local().format('DD/MM/YYYY HH:mm:ss');
  };

  const handleScanResult = (result) => {
    setTicketId(result);
    fetchTicketInfo(result);
  };

  const handleSwitchChange = (checked) => {
    setIsQrScanner(checked);
  };

  const fetchTicketInfo = async (id) => {
    setLoading(true);
    try {
      const response = await CheckinTicketService(id, user.accountId);
      console.log('respone', response);
      if (response.status === 400 && response.message === 'EarlyToCheckin') {
        toast.error('Chưa đến thời gian check-in');
        setTicketId('');
      }
      if (response.status === 400 && response.message === 'CheckinTimeIsOver') {
        toast.error('Hết giờ check-in!');
        setTicketId('');
      }
      if (response.status === 400 && response.message === 'NotFoundTicket') {
        toast.error('Vé không tồn tại!');
        setTicketId('');
      }
      else if (response.status === 200 && response.message === 'AlreadyCheckedIn') {
        toast.error('Vé đã check-in!');
        setTicketInfo(response.data);
        setShowTicketModal(true);
      }
      else if (response.status === 200 && response.message === 'TicketFoundAndCheckedIn') {
        toast.success('Vé hợp lệ');
        setTicketInfo(response.data);
        setShowTicketModal(true);
      }
      else if (response.status === 500 && response.message === 'ErrorUpdatingCheckInStatus') {
        toast.error('Lỗi cập nhật trạng thái!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
      console.error('Fail to fetch ticket info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCheckinForm = () => {
    if (ticketId) {
      fetchTicketInfo(ticketId);
    }
  };

  const handleModalClose = () => {
    setShowTicketModal(false);
    setTicketId('');
    setTicketInfo({});
  };

  const handleShowEvents = async () => {
    setLoading(true);
    try {
      const response = await GetEventByStaffService(user.accountId);
      if (response.result.result) {
        setEvents(response.result.result);
        setShowMyEventsModal(true);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải sử kiện!');
      console.error('Fail to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavbarStaff />
      <div className="bg bg-light p-3" style={{ minHeight: '100vh' }}>
        <CustomSwitch
          checkedChildren="Quét mã"
          unCheckedChildren="Nhập mã"
          onChange={handleSwitchChange}
          style={{ marginBottom: '20px' }}
        />
        <br />
        <Text style={{textDecoration:'underline', cursor:'pointer'}} onClick={handleShowEvents}>Sự kiện của bạn</Text>
        {isQrScanner ? (
          <QrScannerComponent onScanResult={handleScanResult} />
        ) : (
          <>
            <Form onFinish={handleSubmitCheckinForm}>
              <div className="my-3">
                <Form.Item rules={[
                  { required: true, message: 'Nhập mã vé!' }
                ]}>
                  <Input
                    placeholder="Nhập mã vé"
                    type="number"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    style={{ width: '70%' }}
                  />
                </Form.Item>
              </div>
              <Form.Item>
                <CustomButton
                  type="primary"
                  htmlType="submit"
                  //onClick={handleCheckinClick}
                  loading={loading}
                >
                  Check-in
                </CustomButton>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
      <Modal
        title="Thông tin vé"
        open={showTicketModal}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <CustomButton key="ok" type="primary" onClick={handleModalClose}>
            OK
          </CustomButton>,
        ]}
        centered
      >
        <Spin spinning={loading}>
          <div style={{ padding: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Title level={5}>Mã vé:</Title>
                <Text>{ticketInfo.ticketCode}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Loại vé:</Title>
                <Text>{ticketInfo.ticketType}</Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Title level={5}>Sự kiện:</Title>
                <Text>{ticketInfo.eventName}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Thời gian bắt đầu:</Title>
                <Text>{formatDateTime(ticketInfo.eventStartTime)}</Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Title level={5}>Đã check-in:</Title>
                <Text>Đã check-in</Text>
              </Col>
              {ticketInfo.isCheckedIn && (
                <Col span={12}>
                  <Title level={5}>Thời gian check-in:</Title>
                  <Text>{formatDateTime(ticketInfo.checkInDate)}</Text>
                </Col>
              )}
            </Row>
          </div>
        </Spin>
      </Modal>
      <Modal
        title="Sự kiện của bạn"
        open={showMyEventsModal}
        onOk={() => setShowMyEventsModal(false)}
        onCancel={() => setShowMyEventsModal(false)}
        footer={[
          <CustomButton key="ok" type="primary" onClick={() => setShowMyEventsModal(false)}>
            OK
          </CustomButton>,
        ]}
        centered
      >
        <Spin spinning={loading}>
          <div style={{ padding: '16px' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col span={24}>
                <Text type="danger">Lưu ý: Bạn chỉ có thể check-in vé từ các sự kiện sau. Thời gian sớm nhất để check-in là trước 2 tiếng diễn ra sự kiện, và muộn nhất sau 45 phút.</Text>
              </Col>
            </Row>
            {events.map(event => (
              <Row key={event.eventId} gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Title level={5}>Tên sự kiện:</Title>
                  <Text>{event.eventName}</Text>
                </Col>
                <Col span={12}>
                  <Title level={5}>Thời gian bắt đầu:</Title>
                  <Text>{formatDateTime(event.startTime)}</Text>
                </Col>
              </Row>
            ))}
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default CheckinTicket;