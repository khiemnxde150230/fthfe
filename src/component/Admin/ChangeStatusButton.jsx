import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ChangeStatusEventService } from '../../services/EventService';  
import '../../assets/css/button.css'; 

const ChangeStatusButton = ({ eventId, currentStatus, onStatusChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmChange = async () => {
    setLoading(true);
    try {
      const newStatus = currentStatus === 'Chờ duyệt' ? 'Đã duyệt' : 'Chờ duyệt';
      await ChangeStatusEventService(eventId, newStatus);
      onStatusChange(newStatus); 
    } catch (error) {
      console.error('Error changing event status:', error);
      alert('Error changing event status. Please try again.');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const getButtonClass = () => {
    if (currentStatus === 'Chờ duyệt') {
      return "btn-tooltip btn btn-outline-info btn-sm";
    } else {
      return "btn-tooltip btn btn-outline-danger btn-sm";
    }
  };

  const getButtonIcon = () => {
    if (currentStatus === 'Chờ duyệt') {
      return "icon-check-circle";
    } else {
      return "icon-x-circle";
    }
  };

  const getButtonTitle = () => {
    if (currentStatus === 'Chờ duyệt') {
      return "Duyệt";
    } else {
      return "Hủy duyệt";
    }
  };

  return (
    <>
      <button
        className={getButtonClass()}
        title={getButtonTitle()}
        onClick={handleStatusClick}
      >
        <i className={getButtonIcon()}></i>
      </button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentStatus === 'Chờ duyệt' ? 'Duyệt Sự kiện' : 'Hủy duyệt Sự kiện'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentStatus === 'Chờ duyệt' 
            ? 'Bạn có muốn duyệt sự kiện này không?' 
            : 'Bạn có muốn hủy duyệt sự kiện này không?'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
            Từ chối
          </Button>
          <Button variant="primary" onClick={handleConfirmChange} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Chấp nhận'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChangeStatusButton;