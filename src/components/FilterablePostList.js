import React from "react";
import { connect } from "react-redux";

import SearchBar from "./SearchBar";
import PostList from "./PostList";
import { getVisiblePosts } from "./../selectors/posts";
import CountryFilter from "./CountryFilter";
import GoogleMaps from "./GoogleMaps";

export class FilterablePostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      withCountryFilter:
        this.props.withCountryFilter === undefined
          ? true
          : this.props.withCountryFilter,
      withMap:
        this.props.withMap === undefined ? true : this.props.withCountryFilter
    };
  }

  getNoPostText() {
    if (this.props.posts.length === 0) {
      return this.props.noPostText;
    } else if (this.props.filteredPosts.length === 0) {
      const {
        text: textFilter,
        countryCode: countryFilter
      } = this.props.filters;
      let noResultFoundSentence = "No results were found";
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
      <div className="flex">
        <div
          className={`${this.state.withMap ? "pr1" : ""}`}
          style={{ width: this.state.withMap ? "70%" : "100%" }}
        >
          {this.props.posts.length > 0 && (
            <div className="filters">
              <div className={`filters__search-bar-container`}>
                <SearchBar
                  className="filters__search-bar"
                  autoFocus={this.props.SearchBarAutoFocus}
                />
              </div>
              {this.state.withCountryFilter && (
                <CountryFilter className="filters__country" />
              )}
            </div>
          )}
          <PostList
            editable={this.props.editable}
            className="post-list post-list--no-border-top"
            posts={this.props.filteredPosts}
            noPostText={this.getNoPostText()}
          />
        </div>

        {this.state.withMap && (
          <div style={{ width: "30%" }}>
            <GoogleMaps {...this.props.googleMapsProps} />
          </div>
        )}
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
