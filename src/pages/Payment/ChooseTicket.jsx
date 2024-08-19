import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/header.css";
import "../../assets/css/chooseticket.css";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { UserContext } from "../../context/UserContext";
import { PaymentForUser } from "../../services/PaymentService";
import { toast } from "react-toastify";
import { CancelOrderOfUser } from "../../services/PaymentService";
import { CheckOrderdOfUser } from "../../services/PaymentService";
import { faArrowUpAZ } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

function ChooseTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};
  const [disable, setDisable] = useState(true);
  const [countTicket, setCountTicket] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [allowOrder, setAllowOrder] = useState(0);
  const { user } = useContext(UserContext);

  const ticketList =
    event?.tickettypes?.map((ticket) => ({
      id: ticket.ticketTypeId,
      type: ticket.typeName,
      price: ticket.price,
      quantity: ticket.quantity,
    })) || [];

  const [quantities, setQuantities] = useState(ticketList.map(() => 0));

  useEffect(() => {
    const checkOrderOrNot = async () => {
      try {
        const resultCheck = await CheckOrderdOfUser(user.accountId, event.eventId);
        return resultCheck;
      } catch (error) {
        console.error('Error checking order:', error);
        return { status: 500 };
      }
    };
  
    const revertOrderIfNecessary = async () => {
      if (user) {
        return;
      }
      try {
        const result = await CancelOrderOfUser(user.accountId);
        if (result.status === 200) {
          console.log('Order successfully reverted');
        } else {
          console.warn('Failed to revert order');
        }
      } catch (error) {
        console.error('Error reverting order:', error);
      }
    };
  
    const handleOrderCheck = async () => {
      const resultCheck = await checkOrderOrNot();
      if (resultCheck.status === 400) {
        await revertOrderIfNecessary();
        setAllowOrder(0);
      } else {
        setAllowOrder(1);
      }
  
      const totalQuantity = quantities.reduce((acc, curr) => acc + curr, 0);
      setCountTicket(totalQuantity);
      setDisable(totalQuantity === 0 || totalQuantity > 2);
  
      const totalPrice = quantities.reduce(
        (acc, curr, index) => acc + curr * ticketList[index].price,
        0
      );
      setTotalPrice(totalPrice);
    };
  
    handleOrderCheck();
  }, [quantities, ticketList, user.accountId, event.eventId]);
  

  const handleQuantityChange = (index, delta) => {
    setQuantities(
      quantities.map((quantity, i) => {
        if (i === index) {
          const newQuantity = quantity + delta;
          const totalQuantity = quantities.reduce((acc, curr, idx) => {
            return idx === index ? acc + newQuantity : acc + curr;
          }, 0);
          return Math.max(
            0,
            Math.min(2 - (totalQuantity - newQuantity), newQuantity)
          );
        }
        return quantity;
      })
    );
  };

  const handleContinue = async () => {
    const selectedTickets = ticketList.map((ticket, index) => ({
      ticketTypeId: ticket.id,
      priceTicket: ticket.price,
      quantity: quantities[index],
    })).filter(ticket => ticket.quantity > 0);
    const paymentDTO = {
      accountId: user.accountId,
      eventId: event.eventId,
      totalPayment: totalPrice,
      ticketBuyeds: selectedTickets,
    };
    const result = await PaymentForUser(paymentDTO);
    if(result.status == 200)
    {
      var orderId = result.orderId;
      navigate("/payment", {
        state: {
          event,
          totalPrice,
          quantities,
          ticketList,
          paymentDTO,
          orderId
        },
      });
    } 
    else
    {
      toast.error('Order thất bại');
    }
  }

  // if (!event) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Header />
      <div className="choose-ticket">
        <div className="ticket-header">
          <h1 style={{ justifyContent: "center" }}>Chọn vé</h1>
        </div>
        <div className="containerTicket">
          <div className="ticket-list">
            <div className="ticket-row header">
              <span className="ticket-type">Loại vé</span>
              {/* <span className="ticket-type">Mô tả</span> */}
              <span className="ticket-price">Giá vé</span>
              <span className="ticket-quantity">Số lượng</span>
            </div>
            {ticketList.map((ticket, index) => (
              <div key={ticket.id} className="ticket-row">
                <span className="ticket-type">{ticket.type}</span>
                <span
                    className={ticket.quantity === 0 ? "sold-out" : "available"}
                  >
                    {ticket.quantity === 0
                      ? "Hết vé"
                      : `${ticket.price.toLocaleString()} đ`}
                  </span>
                <span className="ticket-quantity">
                  {allowOrder == 0 && (
                    <button
                    onClick={() => handleQuantityChange(index, -1)}
                    disabled={quantities[index] === 0}
                  >
                    -
                  </button>
                  )}
                  {allowOrder == 1 && (
                    <button>
                    -
                  </button>
                  )}
                  
                  <span>{quantities[index]}</span>
                  {allowOrder == 0 && (
                     <button
                     onClick={() => handleQuantityChange(index, 1)}
                     disabled={ticket.quantity === 0}
                   >
                     +
                   </button>
                  )}
                  {allowOrder == 1 && (
                     <button>
                     +
                   </button>
                  )}
                 
                </span>
              </div>
            ))}
            <div className="note">
              Lưu ý: Mỗi tài khoản chỉ được đặt tối đa 2 vé.
            </div>
          </div>
          <div className="ticket-summary" style={{ backgroundColor: "black" }}>
            <h2>{event.eventName}</h2>
            <p>
            {moment.utc(event.startTime).local().format('HH:mm')},{" "}
            {moment.utc(event.startTime).local().format('DD/MM/YYYY')}
            </p>
            <p>{event.location}</p>
            <div className="ticket-prices">
              {ticketList.map((ticket) => (
                <div key={ticket.type} className="price-row">
                  <span>{ticket.type}</span>
                  <span
                    className={ticket.quantity === 0 ? "sold-out" : "available"}
                  >
                    {ticket.quantity === 0
                      ? "Hết vé"
                      : `${ticket.price.toLocaleString()} đ`}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div className="quantity-info h5 mt-3">
                {countTicket > 0 && (
                  <>
                    <div>
                      <i className="bi-ticket-perforated me-2"></i>
                    </div>
                    <div className="quantity">x{countTicket}</div>
                  </>
                )}
              </div>
              {allowOrder == 0 && (
                <button
                disabled={disable}
                className="select-button mt-1"
                onClick={handleContinue}
              >
                {disable
                  ? "Vui lòng chọn vé"
                  : `Tiếp tục - ${totalPrice.toLocaleString()} đ`}
              </button>
              )}
              {allowOrder == 1 && (
                <button
                disabled={disable}
                className="select-button mt-1"
              >
                Bạn đã đặt vé 
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ChooseTicket;
