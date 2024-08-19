import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmButton = ({ accountId, onConfirm }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    onConfirm(accountId); // Gọi hàm onConfirm và truyền accountId
    setShowModal(false); // Đóng modal sau khi xác nhận
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-tooltip btn btn-outline-success btn-sm"
        title="Duyệt"
      >
        <i className="icon-check1"></i>
      </button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận duyệt người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có muốn duyệt người dùng này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Không
          </Button>
          <Button variant="success" onClick={handleConfirm}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmButton;
