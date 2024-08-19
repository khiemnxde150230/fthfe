import React, { useEffect, useState, useContext } from 'react';
import { Card, List, Statistic, Row, Col, Rate } from 'antd';
import { GetEventStatisticsService } from '../../services/EventService';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../component/Organizer/Navbar";
import Footer from '../../component/Footer';
import { decodeId } from '../../utils/utils';
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-toastify';



const EventStatistics = () => {
  const { user } = useContext(UserContext);
  const { encodedId } = useParams();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState(decodeId(encodedId));
  const navigate = useNavigate();

  const fetchStatistics = async () => {
    try {
      const response = await GetEventStatisticsService(eventId);
      console.log('organizerid',response.eventStatus.organizerId)
      console.log('organizerid from context', user?.accountId);
      if (response.eventStatus.organizerId !== user?.accountId) {
        toast.error('Không có quyền truy cập!')
        navigate('/organizer/events');
      }
        setStatistics(response);
    } catch (error) {
      console.error('Error fetching event statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useeffect was called');
    if (!user.accountId) {
      console.error('accountid', user.accountId);
      //setLoading(false);
      return;
    }
    try {
      fetchStatistics();
    }
    catch (e) {
      console.error('error', e);
    }
  }, [eventId, user.accountId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar />
    <Card 
      title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Thống kê cho sự kiện: {statistics.eventStatus.eventName}</span>}
    >
      <Row gutter={16} className='mb-3'>
      <Col span={8}>
          <Statistic title="Trạng thái" value={statistics.eventStatus.eventStatus} />
        </Col>
        <Col span={8}>
          <Statistic title="Số vé đã cung cấp" value={statistics.numOfTicketSold} />
        </Col>
        <Col span={8}>
          <Statistic title="Tổng doanh thu" value={statistics.totalRevenue}/>
        </Col>
        {statistics.eventStatus.eventStatus === "Đã kết thúc" && (
            <>
          <Col span={8}>
            <Statistic title="Người tham dự thực tế" value={statistics.actualParticipants} />
          </Col>
          <Col span={8}>
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Đánh giá trung bình: </span>
            <Rate disabled value={statistics.eventRating.averageRating} />
            <span style={{ marginLeft: 8 }}>({statistics.eventRating.ratingCount} đánh giá)</span>
          </div>
        </Col>
        </>
        )}        
      </Row>
      <List
        header={<div>Số vé đã cung cấp theo loại vé</div>}
        bordered
        dataSource={statistics.ticketSalesPerTicketType}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={`Loại vé: ${item.ticketType}`}
              description={`Số vé cung cấp: ${item.numberOfTicketsSold}`}
            />
          </List.Item>
        )}
      />
      <List
        className='mt-3'
        header={<div>Số lượng vé còn lại</div>}
        bordered
        dataSource={statistics.ticketSalesPerTicketType}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={`Loại vé: ${item.ticketType}`}
              description={`Số lượng: ${item.remainingTickets}`}
            />
          </List.Item>
        )}
      />
    </Card>
    <Footer/>
    </>
  );
};

export default EventStatistics;
