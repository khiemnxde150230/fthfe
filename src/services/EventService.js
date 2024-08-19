import request from '../utils/request';

export const GetEventsService = async () => {
    try {
        const response = await request({
            method: "get",
            url: "event/getAllEvent",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetEventsForAdminService = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'event/getAllEventAdmin',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetEventsByAccountService = async (accountId) => {
    try {
        const response = await request({
            method: "get",
            url: `event/getEventByAccount?accountId=${accountId}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetEventByIdService = async (id) => {
    try {
        const response = await request({
            method: "get",
            url: `event/getEventById?eventId=${id}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetEventByCategoryService = async (id) => {
    try {
        const response = await request({
            method: "get",
            url: `event/getEventByCategory?categoryId=${id}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const AddEventService = async (data) => {
    try {
        const response = await request({
            method: "post",
            url: "event/addEvent",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetEventForEdit = async (id) => {
    try {
        const response = await request({
            method: "get",
            url: `event/getEventForEdit?eventId=${id}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const UpdateEventService = async (data) => {
    try {
        const response = await request({
            method: "post",
            url: "event/editEvent",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetUpcomingEventService = async () => {
    try {
        const response = await request({
            method: "get",
            url: "event/getUpcomingEvent",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

// export const DeleteEventService = async (id) => {
//     try {
//         const response = await request({
//             method: "delete",
//             url: `event/${id}`,
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//         return response;
//     } catch (e) {
//         return e;
//     }
// }

export const ChangeStatusEventService = async (eventId, newStatus) => {
    try {
        const response = await request({
            method: 'post',
            url: `event/changeEventStatus?eventId=${eventId}&status=${newStatus}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        throw new Error(`Error changing event status: ${error.message}`);
    }
};

//update for organizer manage

export const GetTicketTypeByEventService = async (id) => {
    try {
        const response = await request({
            method: "get",
            url: `event/getTicketTypeByEvent?eventId=${id}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
};

export const UpdateTicketQuantityService = async (ticketTypeId, addQuantity) => {
    try {
        const response = await request({
            method: "put",
            url: `event/updateTicketQuantity?ticketTypeId=${ticketTypeId}&addQuantity=${addQuantity}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
};

export const GetDiscountCodeByEventService = async (id) => {
    try {
        const response = await request({
            method: "get",
            url: `event/getDiscountCodeByEvent?eventId=${id}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const AddDiscountCodeService = async (data) => {
    try {
        const response = await request({
            method: "post",
            url: "event/addDiscountCode",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const UpdateDiscountQuantityService = async (discountId, addQuantity) => {
    try {
        const response = await request({
            method: "put",
            url: `event/updateDiscountQuantity?discountId=${discountId}&addQuantity=${addQuantity}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetEventStatisticsService = async (eventId) => {
    try {
        const response = await request({
            method: "get",
            url: `event/getEventStatistics?eventId=${eventId}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const SearchEventByContainTiTile = async (searchString) => {
    try {
        const response = await request({
            method: "get",
            url: `event/searchEventByContainTiTile?searchString=${searchString}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}


export const SearchEventByFilter = async (searchString) => {
    try {
        const response = await request({
            method: "get",
            url: `event/searchEventByFilter?filter=${searchString}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}

export const GetEventsUserService = async () => {
    try {
        const response = await request({
            method: "get",
            url: "event/getAllEventUser",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (e) {
        return e;
    }
}