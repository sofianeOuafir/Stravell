import React from "react";
import PostListItem from "./PostListItem";

const PostList = props => {
  const editable = props.editable ? true : false;
  const className = props.className ? props.className : "post-list"
  return (
    props.posts.length > 0 ? (
      <div className={className}>
        {props.posts.map((post, key) => (
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
        {props.noPostText}
      </h2>
    )
  );
};

export default PostList;
