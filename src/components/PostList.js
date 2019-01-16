import React from "react";
import PostListItem from "./PostListItem";

const PostList = ({ editable, className, posts, noPostText }) => {
  editable = editable ? editable : false;
  className = className ? className : "post-list"
  return (
    posts.length > 0 ? (
      <div className={className}>
        {posts.map((post, key) => (
          <PostListItem
            key={key}
            index={key}
            post={post}
            editable={editable}
          />
        ))}
      </div>
    ) : (
      <h2 className="favourite-font-weight">
        {noPostText}
      </h2>
    )
  );
};

export default PostList;
