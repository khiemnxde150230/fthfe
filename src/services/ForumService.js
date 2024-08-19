import request from '../utils/request';

const END_POINTS = {
  GET_ALL_POST: 'forum/getAllPost',
  GET_BY_ID: 'forum/getPostDetail',
  ADD_POST: 'forum/AddPost',
  GET_BY_STATUS: 'forum/GetPostByStatus',
  CHANGE_POST_STATUS: 'forum/ChangeStatusPost',
  LIKE_POST: '/forum/LikePost',
  UNLIKE_POST: '/forum/UnlikePost',
  DELETE_POST: '/forum/DeletePost',
  SAVE_POST: '/forum/SavePost',
  UNSAVE_POST: '/forum/UnSavePost',
  GET_SAVED_POST: '/forum/GetSavedPostByAccount'
};

export const getAllPostService = async () => await request.get(END_POINTS.GET_ALL_POST);

export const getPostByIdService = async (postId) => await request.get(`${END_POINTS.GET_BY_ID}?postId=${postId}`);

export const addPostService = async (data) => await request.post(END_POINTS.ADD_POST, data);

export const getPostByStatusService = async (status, accountId) =>
  await request.get(`${END_POINTS.GET_BY_STATUS}?status=${status}&accountId=${accountId}`);

export const deletePostService = async (postId) => await request.post(`${END_POINTS.DELETE_POST}?postId=${postId}`);

export const changePostStatusService = async (postId, status) => await request.post(`${END_POINTS.CHANGE_POST_STATUS}?postId=${postId}&status=${status}`);

export const likePostService = async (postId, accountId) => await request.post(`${END_POINTS.LIKE_POST}?postId=${postId}&accountId=${accountId}`);

export const unlikePostService = async (postId, accountId) => await request.delete(`${END_POINTS.UNLIKE_POST}?postId=${postId}&accountId=${accountId}`);

export const savePostService = async (postId, accountId) => await request.post(`${END_POINTS.SAVE_POST}?postId=${postId}&accountId=${accountId}`);

export const unSavePostService = async (postId, accountId) => await request.delete(`${END_POINTS.UNSAVE_POST}?postId=${postId}&accountId=${accountId}`);

export const getSavedPostService = async (accountId) => await request.get(`${END_POINTS.GET_SAVED_POST}?accountId=${accountId}`);


export const GetAllPost = async () => {
  try {
    const response = await request({
      method: 'get',
      url: `forum/GetAllPost`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    return e;
  }
};

export const GetAllPostAdmin = async () => {
  try {
    const response = await request({
      method: 'get',
      url: 'forum/getAllPostAdmin',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    throw e;
  }
};

export const ChangeStatusPost = async (postId, status) => {
  try {
    const response = await request({
      method: 'post',
      url: `forum/ChangeStatusPost`,
      params: { postId, status },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    console.error('Error in ChangeStatusPost:', e);
    throw e;
  }
};