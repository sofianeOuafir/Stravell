import React from 'react';
import PostListItem from './PostListItem';

const PostList = (props) => (
  <div>
    { 
      props.posts.map((post, key) => (
        <PostListItem key={key} post={post} />
      ))
    }
  </div>
);

export default PostList;