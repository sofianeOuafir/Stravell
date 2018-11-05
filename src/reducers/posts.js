import { FaAcquisitionsIncorporated } from "react-icons/fa";

const postsReducer = (state = [], action) => {
  switch(action.type) {
    case 'ADD_POST':
      return [
        ...state,
        action.post
      ]
    case 'EDIT_POST':
      return state.map((post) => {
        if(post.id === action.id){
          return {
            ...post,
            ...action.updates
          }
        }else {
          return post;
        }
      })
    case 'SET_POSTS': 
      return action.posts
    default:
      return state;
  }
};

export default postsReducer;

