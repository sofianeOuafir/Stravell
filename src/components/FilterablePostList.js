import React from "react";
import { connect } from "react-redux";
import Toggle from "react-toggle";

import SearchBar from "./SearchBar";
import PostList from "./PostList";
import { getVisiblePosts } from "./../selectors/posts";
import CountryFilter from "./CountryFilter";
import GoogleMaps from "./GoogleMaps";
import BreadCrumb from "./Breadcrumb";
import { setMapVisibility } from './../actions/map';

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
    const { breadCrumbProps, googleMapsProps, map, setMapVisibility } = this.props;
    return (
      <div className="flex flex-direction--column">
        <div className="flex justify-content--between align-items--center mb1">
          <BreadCrumb {...breadCrumbProps} />
          <div className="flex align-items--center show-for-laptop">
            <label className="mr1 c-warm-peach favourite-font-weight" htmlFor="showMap">Show Map</label>
            <Toggle
              id="showMap"
              defaultChecked={map.visible}
              onChange={() => setMapVisibility(!this.props.map.visible)}
            />
          </div>
        </div>
        <div className="flex">
          <div
            className={`filterable-post-list__list-container ${
              this.state.withMap ? "pr1" : ""
            }`}
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

          {this.state.withMap && map.visible && (
            <div className="filterable-post-list__map-container">
              <GoogleMaps {...googleMapsProps} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setMapVisibility: (visible) => dispatch(setMapVisibility(visible))
});

const mapStateToProps = ({ filters, map }, { posts }) => {
  return {
    posts,
    filteredPosts: getVisiblePosts(posts, filters),
    filters,
    map
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterablePostList);
