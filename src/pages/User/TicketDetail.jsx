import React, { useEffect, useState, useContext } from "react";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { RightOutlined } from "@ant-design/icons";
import QRCode from "qrcode.react";
import { useParams, useNavigate } from "react-router-dom";
import { GetTicketByIdService } from "../../services/TicketService";
import { UserContext } from "../../context/UserContext";
import moment from "moment/moment";
import { toast } from "react-toastify";

const TicketDetail = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [ticket, setTicket] = useState({});
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return moment.utc(dateString).local().format("DD/MM/YYYY HH:mm");
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        if (!user) {
          return;
        }
        const response = await GetTicketByIdService(id, user?.accountId);
        if (response.status === 400) {
          navigate("/404");
        }
        setTicket(response);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [id, user?.accountId]);

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg bg-dark">
      <Header />
      <Container style={{ marginBottom: "3rem", color: "white" }}>
        <div className="breadcrumb">
          Trang chủ <RightOutlined /> Vé đã mua <RightOutlined /> Chi tiết vé
        </div>
      </Container>

      <Container>
        <Card className="mb-3 bg-dark">
          <Card.Img variant="top" src={ticket.themeImage} />
          <Card.Body className="card-body-ticket bg-light">
            <Card.Title className="text-center text-black">{ticket.eventName}</Card.Title>
            <Card.Text className="text-center" style={{marginTop:"5px"}}>
              <QRCode value={String(ticket.ticketId)} />
            </Card.Text>
          </Card.Body>
        </Card>

        <Row>
          <Col md={12}>
            <Card className="bg-dark">
              <Card.Body>
                <Card.Title className="mb-2">Thông tin đặt vé</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Loại vé:</strong> {ticket.typeName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Thời gian:</strong> {formatDate(ticket.startTime)} -{" "}
                    {formatDate(ticket.endTime)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Mã order:</strong> {ticket.orderId}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Ngày đặt hàng:</strong>{" "}
                    {formatDate(ticket.orderDate)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {ticket.paymentAmount === 0 ? "Miễn phí" : "payOS"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Số lượng:</strong> {ticket.quantity}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Tổng tiền:</strong>{" "}
                    {ticket.paymentAmount?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3 mb-3">
          <Col md={12}>
            <Card className="bg-dark">
              <Card.Body>
                <Card.Title className="mb-2">Thông tin người mua</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Tên:</strong> {ticket.fullName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Email:</strong> {ticket.email}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Số điện thoại:</strong> {ticket.phone}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default TicketDetail;