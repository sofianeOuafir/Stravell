import React from "react";
import { connect } from "react-redux";

import SearchBar from "./SearchBar";
import PostList from "./PostList";
import { getVisiblePosts } from "./../selectors/posts";
import CountryFilter from "./CountryFilter";

export class FilterablePostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      withCountryFilter: this.props.withCountryFilter === undefined
        ? true
        : this.props.withCountryFilter
    };
  }

  getNoPostText() {
    const { text: textFilter, countryCode: countryFilter } = this.props.filters;
    if (this.props.posts.length === 0) {
      return this.props.noPostText;
    } else if (this.props.filteredPosts.length === 0) {
      let noResultFoundSentence = "No results were found ";
      if (textFilter && countryFilter) {
        return `${noResultFoundSentence} for text: ${textFilter}, country: ${countryFilter}`;
      } else if (textFilter) {
        return `${noResultFoundSentence} for text: ${textFilter}`;
      } else if (countryFilter) {
        return `${noResultFoundSentence} for country: ${countryFilter}.`;
      }
    }
  }

  render() {
    return (
      <div>
        {this.props.posts.length > 0 && (
          <div className="flex justify-content--between align-items--center">
            <SearchBar
              containerClassName="flex-grow"
              autoFocus={this.props.SearchBarAutoFocus}
            />
            {this.state.withCountryFilter && <CountryFilter />}
          </div>
        )}
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
    posts,
    filteredPosts: getVisiblePosts(posts, filters),
    filters
  };
};

export default connect(mapStateToProps)(FilterablePostList);
