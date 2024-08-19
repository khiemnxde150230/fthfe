import request from '../utils/request';

export const EditEventRatingService = async (data) => {
  try {
    const response = await request({
      method: 'post',
      url: 'EventRating/editEventRating',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    });
    return response;
  } catch (e) {
    throw new Error(`Error editing event rating: ${e.message}`);
  }
};

export const GetRatingByRatingIdService = async (ratingId, userId) => {
  try {
    const response = await request({
      method: 'get',
      url: `EventRating/ratingByRatingId?ratingId=${ratingId}&userId=${userId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    throw e;
  }
};

export const GetAllRatingsService = async () => {
  try {
    const response = await request({
      method: 'get',
      url: 'EventRating/getall',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    throw new Error(`Error getting all ratings: ${e.message}`);
  }
};

export const UpdateRatingStatusService = async (ratingId, status) => {
  try {
    const response = await request({
      method: 'put',
      url: `EventRating/updateRatingStatus?ratingId=${ratingId}&status=${status}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    throw new Error(`Error updating rating status: ${e.message}`);
  }
};

export const DeleteRatingService = async (ratingId) => {
  try {
    const response = await request({
      method: 'delete',
      url: `EventRating/deleteRating?ratingId=${ratingId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    throw new Error(`Error deleting rating: ${e.message}`);
  }
};
export const GetRateByEventIdService = async (eventId) => {
  try {
    const response = await request({
      method: 'get',
      url: `EventRating/getRateByEventId?eventId=${eventId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    throw new Error(`Error getting ratings by event ID: ${e.message}`);
  }
};
export const CheckRatingStatusService = async (ratingId) => {
  try {
    const response = await request({
      method: 'get',
      url: `EventRating/check-status/${ratingId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (e) {
    console.error('Error in CheckRatingStatusService:', e);
    throw e;
  }
};
