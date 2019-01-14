import React from "react";
import { connect } from "react-redux";
import SearchBar from "./SearchBar";
import PostList from "./PostList";
import { getVisiblePosts } from "./../selectors/posts";

export class FilterablePostList extends React.Component {
  constructor(props) {
    super(props);
  }

  getNoPostText() {
    if(this.props.posts.length === 0) {
      return this.props.noPostText;
    } else if (this.props.filteredPosts.length === 0) {
      return `No results were found for ${this.props.filters.text}.`;
    }
  }

  render () {
    return (
      <div>
        {this.props.posts.length > 0 && <SearchBar autoFocus={this.props.SearchBarAutoFocus} />}
        <PostList
          editable={this.props.editable}
          className="post-list post-list--no-border-top"
          posts={this.props.filteredPosts}
          noPostText={this.getNoPostText()}
        />
      </div>
    );
  }
}


const mapStateToProps = ({ filters }, { posts }) => {
  return {
    posts: posts,
    filteredPosts: getVisiblePosts(
      posts,
      filters
    ),
    filters
  }
};

export default connect(
  mapStateToProps
)(FilterablePostList);
