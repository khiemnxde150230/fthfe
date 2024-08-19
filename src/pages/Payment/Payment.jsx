import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/Payment.css";
import { UserContext } from "../../context/UserContext";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import vnpayLogo from "../../assets/images/logo/vnpay.jpg";
import payOS from "../../assets/images/logo/payOS.png";
import { Button, Modal } from "antd";
import qrCodeImage from "../../assets/images/qrcode.png";
import { DeleteTimeOutOrder } from "../../services/PaymentService";
import { ReturnPaymentUrl } from "../../services/PaymentService";
import { CheckInputCoupon } from "../../services/PaymentService";
import moment from "moment";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, totalPrice, quantities, ticketList, paymentDTO, orderId} = location.state || {};

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState(""); // State for discount error message
  const [discountAmount, setDiscountAmount] = useState(0); // State for discount amount
  const [finalTotalPrice, setFinalTotalPrice] = useState(totalPrice);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyDiscount = async () => {
    const result = await CheckInputCoupon(paymentDTO.eventId, discountCode);
    if (result.status === 400) {
      setDiscountCode("");
      setDiscountError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      setDiscountAmount(0);
      setFinalTotalPrice(totalPrice);
    } else {
      setDiscountError("");
      debugger;
      const discount = (result.discountAmount/100); 
      setDiscountAmount(discount);
      setFinalTotalPrice(totalPrice - (totalPrice * discount));
    }
  };

  const [timeLeft, setTimeLeft] = useState({ minutes: 9, seconds: 59 });
  const [timeLeft2, setTimeLeft2] = useState({ minutes: 9, seconds: 59  });
  const [timeUp, setTimeUp] = useState(false); // State to control the popup
  const { user } = useContext(UserContext);

  useEffect(() => {
    const savedStartTime = sessionStorage.getItem("startTime");
    const currentTime = new Date().getTime();

    if (savedStartTime) {
      const elapsedTime = Math.floor((currentTime - savedStartTime) / 1000);
      const remainingTime = 10 * 60 - elapsedTime; // 10 minutes in seconds
      if (remainingTime <= 0) {
        setTimeUp(true);
        setTimeLeft({ minutes: 0, seconds: 0 });
        setTimeLeft2({ minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          minutes: Math.floor(remainingTime / 60),
          seconds: remainingTime % 60,
        });
        setTimeLeft2({
          minutes: Math.floor(remainingTime / 60),
          seconds: remainingTime % 60,
        });
      }
    } else {
      sessionStorage.setItem("startTime", currentTime);
    }

    const countdown = setInterval(async () => {
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
      setTimeLeft2((prevTime) => {
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
      const result = await CallDeleteTimeOutOrder(paymentDTO);
    }, 1000);

    return () => {
      clearInterval(countdown);
      sessionStorage.removeItem("startTime");
    };
  }, []);

  async function CallDeleteTimeOutOrder(paymentDTO) {
    try {
      const response = await DeleteTimeOutOrder(paymentDTO);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  }

  if (!event) {
    return <div>Loading...</div>; // Handle the case where event is not available
  }

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  //#region Handle Modal
  const handleContinue = async () => {
    var data = {
      orderId: orderId,
      discountCode: discountCode
    };
    sessionStorage.removeItem("startTime");
    const response = await ReturnPaymentUrl(data);
    if(response.status == 200)
    {
      if (response.paymentMethod == 0) {
        window.location.href = response.createPayment.checkoutUrl;
      } 
      if (response.paymentMethod == 1) {
        //var url = `/payment-success/${data.orderId}`;
        //window.location.href = url;
        navigate(`/payment-success/${data.orderId}`);
      } 
    }
    // setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //#endregion
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
              {moment.utc(event.startTime).local().format('HH:mm')},{" "}
              {moment.utc(event.startTime).local().format('DD/MM/YYYY')}
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
                    <span className="ticket-price">
                      {ticket.price.toLocaleString()} đ
                    </span>
                    <span>{quantities[index]}</span>
                  </div>
                );
              })}
              <div className="discount-code">
                <label htmlFor="discount">Mã khuyến mãi</label>
                <div className="input-wrapper">
                  <input
                    className="me-2"
                    type="text"
                    id="discount"
                    placeholder="MÃ GIẢM GIÁ"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="apply-button"
                    disabled={!discountCode}
                  >
                    Áp dụng
                  </button>
                </div>
                {discountError && (
                  <p className="error-message">{discountError}</p>
                )}
              </div>

              <div className="ticket-row total">
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString()} đ</span>
              </div>
              {discountAmount > 0 && (
                <div className="ticket-row discount">
                  <span>Giảm giá</span>
                  <span>- {discountAmount.toLocaleString()} đ</span>
                </div>
              )}
              <div className="ticket-row final-total">
                <span>Tổng tiền</span>
                <span>{finalTotalPrice.toLocaleString()} đ</span>
              </div>
            </div>
            <button onClick={handleContinue} className="continue-button">
              Thanh toán
            </button>
          </div>
        </div>

        <div className="payment-methods-container">
          <h3>Phương thức thanh toán</h3>
          <div className="payment-method">
            {/* <input type="radio" id="atm" name="payment" value="atm" /> */}
            <label>
              <img className="rounded rounded-img" src={payOS} alt="ATM" />
              payOS
            </label>
          </div>
          <div className="payment-method">
            {/* <input type="radio" id="atm" name="payment" value="atm" />
            <label>
              <img src={vnpayLogo} alt="ATM" />
              VNPAY
            </label> */}
          </div>
        </div>
      </div>
      
      {timeUp && (
        <div className="popup">
          <div className="popup-content">
            <h5 className="fw-bold" style={{ color: "#EC6C21" }}>
              Hết thời gian giữ vé!
            </h5>
            <p>
              {" "}
              <i
                className="bi bi-bell"
                style={{ fontSize: "40px", color: "black" }}
              ></i>{" "}
            </p>
            <p style={{ fontSize: "16px", color: "black" }}>
              Đã hết thời gian giữ vé. Vui lòng chọn lại vé.
            </p>
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

export default Payment;
