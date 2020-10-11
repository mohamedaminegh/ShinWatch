import axios from 'axios';

import {
    //ADD_POST,
    GET_ERRORS,
    DELETE_POST,
    GET_POSTS,
    GET_POST,
    POST_LOADING,
    CLEAR_ERRORS
} from './types';

// Add Post
export const addPost = (postData , history) => dispatch => {
  dispatch(clearErrors());
    axios
    .post('api/posts',postData)
    
    .then(res => history.push('/posts'))
        .catch(err=>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );  
}
// Get Posts
export const getPosts = () => dispatch => {
    dispatch(setPostLoading());
    axios
      .get('/api/posts')
      .then(res =>{
        dispatch({
          type: GET_POSTS,
          payload: res.data
        })}
      )
      .catch(err =>
        dispatch({
          type: GET_POSTS,
          payload: null
        })
      );
  };
  // Get Post
export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

// Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Like / Remove Like
export const addLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Add Reaction / Remove Reaction
export const addReaction = (id,type)=> dispatch => {
  dispatch(clearErrors());
  const typereaction ={};
  typereaction.type=type;
  axios
    .post(`/api/posts/react/${id}`,typereaction)
    .then(res => dispatch(getPost(id)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Comment
export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/posts/comments/${postId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {axios
    .delete(`/api/posts/comments/${postId}/${commentId}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );}
};

  // Set loading state
export const setPostLoading = () => {
    return {
      type: POST_LOADING
    };
  };
  // Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
