import request from '../utils/request';

// Lấy doanh thu hàng tháng
export const getMonthlyRevenue = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'statistics/monthly-revenue',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        console.error('Error fetching monthly revenue:', e);
        throw e;
    }
};

// Lấy số lượng tài khoản hoạt động
export const getActiveAccount = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'statistics/active-accounts',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        console.error('Error fetching active accounts count:', e);
        throw e;
    }
};

// Lấy các sự kiện được đánh giá cao nhất
export const getTopRatedEvents = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'statistics/top-rated-events',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        console.error('Error fetching top-rated events:', e);
        throw e;
    }
};

// Lấy doanh thu theo sự kiện
export const getEventRevenue = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'statistics/event-revenue',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        console.error('Error fetching event revenue:', e);
        throw e;
    }
};

// Lấy các người tham gia hàng đầu
export const getTopParticipants = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'statistics/top-participants',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        console.error('Error fetching top participants:', e);
        throw e;
    }
};

// Lấy các sự kiện có doanh thu cao nhất
export const getTopRevenueEvents = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'statistics/top-revenue-events',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        console.error('Error fetching top revenue events:', e);
        throw e;
    }
};

// Lấy các sự kiện với số lượng người tham gia cao nhất
export const getTopParticipantsEvents = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'statistics/top-participants-events',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (e) {
        console.error('Error fetching top participants events:', e);
        throw e;
    }
};

// Tạo báo cáo thống kê sự kiện
export const generateEventStatisticsReport = async () => {
    try {
        const response = await request({
            method: 'get',
            url: 'statistics/report',
            responseType: 'blob',
        });
        return response;
    } catch (e) {
        console.error('Error generating event statistics report:', e);
        throw e;
    }
};
