import Ticket from "./component/Ticket";
import SideBar from "./component/SideBar";
import { Container } from "react-bootstrap";
import { RightOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { Link } from "react-router-dom";
import moment from "moment";

import { GetTicketByAccountService } from "../../services/TicketService";

const buttonStyle = {
    height: "1.8rem",
    width: "23.5%",
    borderRadius: "20px",
    fontSize: "1rem",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #EC6C21",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    opacity: 0.7
};

const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#EC6C21",
    color: "#000000",
    opacity: 1
};

const tabStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    color: "#ffffff",
    opacity: 0.7
};

const activeTabStyle = {
    ...tabStyle,
    opacity: 1,
    fontWeight: "bold",
    borderBottom: "2px solid #EC6C21"
};

const MyTicket = () => {
    const { user } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [tickets, setTickets] = useState([]);

    const fetchTickets = async () => {
        try {
            const response = await GetTicketByAccountService(user.accountId);
            setTickets(response);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    useEffect(() => {
        if (!user.accountId) {
            return;
        }
        try {
            fetchTickets();
        } catch (e) {
            console.error(e);
        }
    }, [user.accountId]);

    // Lọc vé dựa trên tab đang được chọn
    const filteredTickets = tickets.filter(ticket => {
        const now = moment();
        const endTime = moment.utc(ticket.endTime).local();
        if (activeTab === "upcoming") {
            return now.isBefore(endTime);
        } else if (activeTab === "ended") {
            return now.isAfter(endTime);
        }
        return true; // Nếu không khớp với tab nào, trả về tất cả
    });

    return (
        <div className="bg bg-dark">
            <Header />
            <Container style={{ marginBottom: "3rem" }}>
                Trang chủ <RightOutlined /> Vé đã mua
            </Container>

            <Container className="d-flex">
                <SideBar />
                <div style={{ marginLeft: "150px" }}>
                    <h2>Vé đã mua</h2>

                    <Flex
                        style={{
                            justifyContent: "center",
                            gap: "1rem",
                            marginBottom: "1rem",
                            paddingTop: "1rem",
                            borderTop: "1px solid #EC6C21",
                            minHeight: "3rem",  // Đảm bảo chiều cao tối thiểu
                            alignItems: "center" // Căn giữa các nút theo chiều dọc
                        }}
                    >
                        <Button
                            style={activeTab === "upcoming" ? activeTabStyle : tabStyle}
                            onClick={() => setActiveTab("upcoming")}
                        >
                            Sắp diễn ra
                        </Button>
                        <Button
                            style={activeTab === "ended" ? activeTabStyle : tabStyle}
                            onClick={() => setActiveTab("ended")}
                        >
                            Đã kết thúc
                        </Button>
                    </Flex>

                    {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <Link
                                key={ticket.ticketId}
                                to={`/myticket/detail/${ticket.ticketId}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <Ticket
                                    orderCode={ticket.ticketId.toString()}
                                    eventName={ticket.eventName}
                                    status={ticket.isCheckedIn ? "Đã sử dụng" : "Chưa sử dụng"}
                                    ticketType={ticket.typeName}
                                    date={moment.utc(ticket.startTime).local().format("DD/MM/YYYY")}
                                    time={moment.utc(ticket.startTime).local().format("HH:mm")}
                                    endDate={moment.utc(ticket.endTime).local().format("DD/MM/YYYY")}
                                    endTime={moment.utc(ticket.endTime).local().format("HH:mm")}
                                    location={ticket.location}
                                    fullLocation={ticket.address}
                                    startDay={moment.utc(ticket.startTime).local().format("DD")}
                                    startMonth={moment.utc(ticket.startTime).local().format("MM")}
                                    startYear={moment.utc(ticket.startTime).local().format("YYYY")}
                                />
                            </Link>
                        ))
                    ) : (
                        <div style={{ textAlign: "center", color: "#ffffff", padding: "2rem 0" }}>
                            Không có vé nào để hiển thị.
                        </div>
                    )}
                </div>
            </Container>
            <Footer />
        </div>
    );
};

export default MyTicket;