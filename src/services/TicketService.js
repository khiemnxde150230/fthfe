import request from '../utils/request';

export const GetTicketByAccountService = async (accountId) => {
    try {
        const response = await request({
            method: "get",
            url: `ticket/getTicketByAccount?accountId=${accountId}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetTicketByIdService = async (id , userId) => {
    try {
        const response = await request({
            method: "get",
            url: `ticket/getTicketById?ticketId=${id}&userId=${userId}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

