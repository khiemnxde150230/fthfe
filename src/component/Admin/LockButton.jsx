import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../assets/css/button.css';

const LockButton = ({ isLocked, onLockChange }) => {
  const [showModal, setShowModal] = useState(false);

  const handleLockClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmLock = () => {
    onLockChange(!isLocked);
    setShowModal(false);
  };

  return (
    <>
      <button
        className="btn-tooltip btn btn-outline-warning btn-sm"
        title={isLocked ? "Mở khóa" : "Khóa"}
        onClick={handleLockClick}
        style={{ marginLeft: '10px' }}
      >
        <i className={isLocked ? "icon-unlock" : "icon-lock"}></i>
      </button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận {isLocked ? "mở khóa" : "khóa"} tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có muốn {isLocked ? "mở khóa" : "khóa"} tài khoản này không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Từ chối
          </Button>
          <Button variant="primary" onClick={handleConfirmLock}>
            Chấp nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LockButton;
