import request from "../utils/request";

export const CheckinTicketService = async (ticketId, staffId) => {
    try {
        const response = await request({
            method: "get",
            url: `staff/checkInTicket?ticketId=${ticketId}&staffId=${staffId}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetEventByStaffService = async (staffId) => {
    try {
        const response = await request({
            method: "get",
            url: `staff/getEventByStaff?staffId=${staffId}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetCheckinHistoryService = async (staffId) => {
    try {
        const response = await request({
            method: "get",
            url: `staff/checkinHistory?staffId=${staffId}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}
