import { createContext, useReducer } from "react";
import postReducer from "../reduces/postReducer";
import {
  addPostService,
  changePostStatusService,
  deletePostService,
  getAllPostService,
  getPostByIdService,
  getPostByStatusService,
  getSavedPostService,
  likePostService,
  savePostService,
  unlikePostService,
  unSavePostService,
} from "../services/ForumService";

const initialState = {
  loading: true,
  posts: [],
  currentPost: {},
  likedNumber: 0,
};

export const PostContext = createContext(null);

const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const { loading, posts, currentPost, likedNumber } = state;

  const getAllPost = async () => {
    try {
      const response = await getAllPostService();
      dispatch({
        type: "GET_POSTS",
        payload: response,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPostById = async (postId) => {
    try {
      const response = await getPostByIdService(postId);
      dispatch({
        type: "GET_POST_DETAILS",
        payload: response,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addPost = async (data) => {
    try {
      await addPostService(data);
      const newPosts = await getAllPostService();
      dispatch({
        type: "GET_POSTS",
        payload: newPosts,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPostByStatus = async (status, accountId) => {
    try {
      const response = await getPostByStatusService(status, accountId);
      dispatch({
        type: "GET_POSTS",
        payload: response,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changePostStatus = async (postId, status) => {
    try {
      await changePostStatusService(postId, status);
    } catch (error) {
      console.log(error);
    }
  };

  const likePost = async (postId, accountId) => {
    try {
      await likePostService(postId, accountId);
    } catch (error) {
      console.log(error);
    }
  };

  const unlikePost = async (postId, accountId) => {
    try {
      await unlikePostService(postId, accountId);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await deletePostService(postId);
    } catch (error) {
      console.log(error);
    }
  };

  const savePost = async (postId, accountId) => {
    try {
      await savePostService(postId, accountId);
    } catch (error) {
      console.log(error);
    }
  };

  const unSavePost = async (postId, accountId) => {
    try {
      await unSavePostService(postId, accountId);
    } catch (error) {
      console.log(error);
    }
  };

  const getSavedPost = async (accountId) => {
    try {
      const response = await getSavedPostService(accountId);
      dispatch({
        type: "GET_POSTS",
        payload: response,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        currentPost,
        likedNumber,
        addPost,
        getAllPost,
        getPostById,
        getPostByStatus,
        changePostStatus,
        deletePost,
        likePost,
        unlikePost,
        savePost,
        unSavePost,
        getSavedPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
