import { IdcardOutlined, FieldTimeOutlined, PushpinFilled } from "@ant-design/icons";
import moment from "moment/moment";

const Ticket = ({ orderCode, eventName, status, ticketType, date, time, endDate, endTime, location, fullLocation, startDay, startMonth, startYear }) => {
    return (
        <>
            <div>
                <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                        <div className="calendar-box d-flex flex-column align-items-center justify-content-center p-2"
                            style={{
                                backgroundColor: "#515158",
                                height: "14.6rem",
                                width: "7rem",
                                borderRadius: "5px 0 0 5px"
                            }}
                        >
                            <span style={{ fontSize: "50px" }}>{startDay}</span>
                            <span style={{ fontSize: "20px" }}>Tháng</span>
                            <span style={{ fontSize: "20px" }}>{startMonth}</span>
                            <span style={{ fontSize: "20px" }}>{startYear}</span>
                        </div>
                        <div className="ml-3 justify-content-center"
                            style={{
                                backgroundColor: "#515158",
                                height: "14.6rem",
                                width: "53rem",
                                alignItems: "center",
                                position: "relative",
                                marginLeft: "3px",
                                padding: "15px",
                                borderRadius: "0 5px 5px 0",
                                color: "#c4c4cf"
                            }}
                        >
                            <h4 className="card-title mb-1" style={{ color: "white" }}>{eventName}</h4>
                            <div className="btn btn-success mb-2 py-1" style={{ borderRadius: "20px" }}>{status}</div>
                            <div className="btn btn-secondary mb-2 py-1" style={{ borderRadius: "20px", marginLeft: "4px" }}>{ticketType}</div>
                            <p className="card-text mb-1"><IdcardOutlined style={{ marginRight: "4px", color: "white" }} /><strong>Order code:</strong> {orderCode}</p>
                            <p className="card-text mb-1"><FieldTimeOutlined style={{ marginRight: "4px", color: "white" }} /><strong>{time}, {date} - {endTime}, {endDate}</strong></p>
                            <p className="card-text mb-1"><PushpinFilled style={{ marginRight: "4px", color: "white" }} /><strong>Địa điểm:</strong> {location}</p>
                            <p className="card-text">{fullLocation}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ticket;