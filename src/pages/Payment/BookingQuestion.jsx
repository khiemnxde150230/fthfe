import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/BookingQuestion.css";
import { UserContext } from "../../context/UserContext";
import Header from "../../component/Header";
import Footer from "../../component/Footer";

const BookingQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, totalPrice, quantities, ticketList } = location.state || {};

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState({ minutes: 9, seconds: 59 });
  const [timeUp, setTimeUp] = useState(false); // State to control the popup
  const { user } = useContext(UserContext);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newSeconds = prevTime.seconds - 1;
        if (newSeconds < 0) {
          const newMinutes = prevTime.minutes - 1;
          if (newMinutes < 0) {
            clearInterval(countdown);
            setTimeUp(true); // Show popup when time is up
            return { minutes: 0, seconds: 0 };
          }
          return { minutes: newMinutes, seconds: 59 };
        }
        return { ...prevTime, seconds: newSeconds };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleContinue = () => {
    // Handle the continue action, e.g., form validation and submission
    console.log("Phone Number:", phoneNumber);
    console.log("Email:", email);
    // navigate to the next step if needed
  };

  if (!event) {
    return <div>Loading...</div>; // Handle the case where event is not available
  }

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div>
      <Header />
      <div className="booking-container">
        <div className="event-header">
          <div className="event-details">
            <h2>{event.eventName}</h2>
            <p>
              <i className="bi bi-geo-alt me-2"></i> 
              {event.location}
            </p>
            <p>
              <i className="bi bi-calendar3 me-2"></i>
              {new Date(event.startTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              ,{" "}
              {new Date(event.startTime).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="countdown-timer">
            <p className="">Hoàn tất đặt vé trong</p>
            <div className="time">
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>:
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="question-table col-lg-8 col-md-10 col-sm-10">
            <div className="ticket-type">
              <h3>Thông tin nhận vé</h3>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  style={{ cursor: "not-allowed" }}
                  type="text"
                  value={user.phone}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Email nhận QR vé</label>
                <input
                  style={{ cursor: "not-allowed" }}
                  type="email"
                  value={user.email}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="ticket-info col-lg-4 col-md-10 col-sm-10">
            <h3>Thông tin đặt vé</h3>
            <div className="ticket-details">
              <div className="ticket-row header">
                <span>Loại vé</span>
                <span className="ticket-price">Giá vé</span>
                <span>Số lượng</span>
              </div>
              {ticketList.map((ticket, index) => {
                if (quantities[index] === 0) return null;
                return (
                  <div key={ticket.type} className="ticket-row">
                    <span>{ticket.type}</span>
                    <span className="ticket-price">{ticket.price.toLocaleString()} đ</span>
                    <span>{quantities[index]}</span>
                  </div>
                );
              })}
              <div className="ticket-row total">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()} đ</span>
              </div>
            </div>
            <button onClick={handleContinue} className="continue-button">
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
      {timeUp && (
        <div className="popup">
          <div className="popup-content">
            <h5 className="fw-bold" style={{ color: "#EC6C21" }}>Hết thời gian giữ vé!</h5>
            <p> <i class="bi bi-bell" style={{fontSize:"40px"}}></i> </p>
            <p style={{fontSize:"16px"}}>Đã hết thời gian giữ vé. Vui lòng chọn lại vé.</p>
            <button onClick={handleBack} className="back-button">
              Quay lại
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BookingQuestion;
