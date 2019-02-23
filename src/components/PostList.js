import React, { Component } from "react";
import PostListItem from "./PostListItem";

class PostList extends React.Component {
  static getVisibleData = (posts, { text }) => {
    text = text.toLowerCase();
    return posts.filter(post => {
      const matchText =
        post.title.toLowerCase().includes(text) ||
        post.description.toLowerCase().includes(text) ||
        (post.address && post.address.toLowerCase().includes(text));
      return matchText;
    });
  };
  render() {
    const {
      editable = false,
      className = "post-list",
      data,
      noDataText
    } = this.props;
    return data.length > 0 ? (
      <div className={className}>
        {data.map((post, key) => (
          <PostListItem key={key} index={key} post={post} editable={editable} />
        ))}
      </div>
    ) : (
      <h2 className="favourite-font-weight">{noDataText}</h2>
    );
  }
}

export default PostList;
