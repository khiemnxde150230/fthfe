import React, { useState, useEffect, useContext } from 'react';
import { Rate, Input, Button, Typography, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/css/RateEvent.css';
import Header from '../../component/Header';
import { EditEventRatingService, GetRatingByRatingIdService, CheckRatingStatusService } from '../../services/EventRatingService';
import { UserContext } from '../../context/UserContext';

const { Title } = Typography;
const { TextArea } = Input;

const RateEvent = () => {
  const { ratingid } = useParams();
  const { user, token, onSetRender } = useContext(UserContext);
  const [existingRating, setExistingRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventName, setEventName] = useState('');
  const [canRate, setCanRate] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      localStorage.setItem('redirectAfterLogin', `/rate/${ratingid}`);
      message.error('Vui lòng đăng nhập để đánh giá sự kiện');
      navigate('/login');
    } else if (user && user.accountId && ratingid) {
      fetchExistingRating();
    } else {
      setError('Thiếu thông tin người dùng hoặc ID đánh giá');
      setIsLoading(false);
    }
  }, [token, user, ratingid, navigate]);

  const fetchExistingRating = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Kiểm tra trạng thái đánh giá
      const statusResponse = await CheckRatingStatusService(ratingid);
      console.log('Status check response:', statusResponse);

      if (statusResponse && statusResponse.status === 200 && statusResponse.ratingStatus) {
        const ratingStatus = statusResponse.ratingStatus.trim().toLowerCase();
        if (ratingStatus === 'active') {
          setCanRate(false);
          message.info('Bạn đã đánh giá sự kiện này và không thể đánh giá lại.');
        } else {
          setCanRate(true);
        }
      } else {
        console.warn('Unexpected response structure from CheckRatingStatusService:', statusResponse);
        // Nếu không có thông tin status, giả định là có thể đánh giá
        setCanRate(true);
      }

      // Lấy thông tin đánh giá hiện tại
      const ratingResponse = await GetRatingByRatingIdService(ratingid, user.accountId);
      console.log('Rating info response:', ratingResponse);

      if (ratingResponse.status === 200 && ratingResponse.data) {
        const ratingData = ratingResponse.data;
        setExistingRating(ratingData);
        setEventName(ratingData.eventName || '');
      } else if (ratingResponse.status === 200 && !ratingResponse.data) {
        setExistingRating({ eventRatingId: ratingid, rating: 0, review: '' });
        setEventName('');
      } else if (ratingResponse.status === 403) {
        setError('Bạn không có quyền xem đánh giá này.');
        message.error('Bạn không có quyền xem đánh giá này.');
        setTimeout(() => navigate('/'),);
      } else {
        throw new Error('Không thể lấy thông tin đánh giá');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`Có lỗi xảy ra: ${error.message}`);
      message.error(`Có lỗi xảy ra: ${error.message}`);
      setTimeout(() => navigate('/'),);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!canRate) {
      message.error('Bạn không thể đánh giá lại sự kiện này.');
      return;
    }

    if (!existingRating || existingRating.rating === 0) {
      message.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      const ratingData = {
        eventRatingId: existingRating.eventRatingId,
        eventId: existingRating.eventId,
        accountId: user.accountId,
        rating: existingRating.rating,
        review: existingRating.review,
      };
      console.log('Submitting rating data:', ratingData);

      const response = await EditEventRatingService(ratingData);
      console.log('Edit rating response:', response);

      if (response.status === 200) {
        message.success('Đánh giá đã được gửi thành công');
        onSetRender(); 
        navigate('/');
      } else {
        message.error('Có lỗi xảy ra khi gửi đánh giá');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      message.error('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!existingRating) {
    return <div>Không tìm thấy đánh giá</div>;
  }

  return (
    <div>
      <Header />
      <div className="rate-event-container">
        <div className="rate-event-content">
          <Title level={2}>Đánh giá sự kiện: {eventName}</Title>
          {canRate ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <Title level={4}>Rating:</Title>
                <Rate 
                  value={existingRating.rating} 
                  onChange={(value) => setExistingRating(prev => ({ ...prev, rating: value }))}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <Title level={4}>Review:</Title>
                <TextArea
                  rows={4}
                  placeholder="Nhập đánh giá của bạn"
                  value={existingRating.review}
                  onChange={(e) => setExistingRating(prev => ({ ...prev, review: e.target.value }))}
                />
              </div>

              <Button type="primary" onClick={handleSubmit}>
                {existingRating.eventRatingId ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
              </Button>
            </>
          ) : (
            <div>
              <p>Bạn đã đánh giá sự kiện này và không thể đánh giá lại.</p>
              <p>Rating: <Rate disabled value={existingRating.rating} /></p>
              <p>Review: {existingRating.review}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateEvent;