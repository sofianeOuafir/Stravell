import React from 'react';
import PostListItem from './PostListItem';

const PostList = (props) => (
  <div className="post-list">
    { 
      props.posts.map((post, key) => (
        <PostListItem key={key} post={post} />
      ))
    }
  </div>
);

export default PostList;