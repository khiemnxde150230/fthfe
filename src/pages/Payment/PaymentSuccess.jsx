import React from "react";
import { Result } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { CheckOrderId } from "../../services/PaymentService";


const PaymentSuccess = () => {
  const { orderId } = useParams();
    const [confirmationStatus, setConfirmationStatus] = useState(null);
    const [confirmationMethod, setConfirmationMethod] = useState(null);

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                const result = await CheckOrderId(orderId);
                debugger;
                console.log(result)
                if (result.paymentMethod == 0) {
                  setConfirmationStatus(result.paymentLinkInformation.status);
                  setConfirmationMethod(result.paymentMethod);
                } 
                else {
                  setConfirmationMethod(result.paymentMethod);
                }
                console.log(confirmationMethod)
            } catch (error) {
                console.error("Error confirming account:", error);
            }
        };
        if (orderId !== undefined) {
          confirmPayment();
      }
      
    }, [orderId]);
  return (
    <>
    <Header/>
      <div className="bg bg-light">      

      {confirmationStatus != "PAID" && confirmationMethod === 0 && (
                    <Result
                    status="error"
                    title="Đặt vé thất bại!"
                    subTitle="Vui lòng kiểm tra lại!"
                    extra={[
                      <Link to="/" key="my-ticket-link">
                        <button
                          style={{
                            backgroundColor: "#EE5007",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: "16px",
                            borderRadius: "4px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#c01f27")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#EE5007")
                          }
                        >
                          Trang chủ
                        </button>
                      </Link>,
                    ]}
                  />
                )}
        
        {confirmationStatus == "PAID" && confirmationMethod === 0 && (
                    <Result
                    status="success"
                    title="Đặt vé thành công!"
                    subTitle="Cảm ơn bạn đã sử dụng dịch vụ!"
                    extra={[
                      <Link to="/myticket" key="my-ticket-link">
                        <button
                          style={{
                            backgroundColor: "#EE5007",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: "16px",
                            borderRadius: "4px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#c01f27")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#EE5007")
                          }
                        >
                          <i className="bi-ticket-perforated me-2"></i>
                          Vé của tôi
                        </button>
                      </Link>,
                    ]}
                  />
                )}
        {confirmationMethod === 1 && (
                    <Result
                    status="success"
                    title="Đặt vé thành công!"
                    subTitle="Cảm ơn bạn đã sử dụng dịch vụ!"
                    extra={[
                      <Link to="/myticket" key="my-ticket-link">
                        <button
                          style={{
                            backgroundColor: "#EE5007",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontSize: "16px",
                            borderRadius: "4px",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#c01f27")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#EE5007")
                          }
                        >
                          <i className="bi-ticket-perforated me-2"></i>
                          Vé của tôi
                        </button>
                      </Link>,
                    ]}
                  />
                )}
      </div>
      <Footer/>
    </>
  );
};

export default PaymentSuccess;
