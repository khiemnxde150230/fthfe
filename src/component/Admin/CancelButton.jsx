import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CancelButton = ({ onRemove }) => {
  const [showModal, setShowModal] = useState(false);




  return (
    <>
      
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-outline-danger btn-sm"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-custom-class="custom-tooltip-danger"
          data-bs-title="Duyet"
        >
          <i className="icon-cancel"></i>
        </button>
  

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận không duyệt người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có muốn không duyệt người dùng này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Không
          </Button>
          <Button variant="danger">
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CancelButton;
