import React from "react";
import { connect } from 'react-redux';

import Layout from "./Layout";
import CountryList from "./CountryList";
import { getAllPlaces } from "./../queries/place";
import FilterableDataList from "./FilterableDataList";
import { getAllPosts } from "../queries/post";
import { HOME_PAGE_TITLE, HOME_PAGE_DESCRIPTION } from "../constants/constants";
import PostList from "./PostList";
import { setPosts } from "./../actions/posts";
import { setPlaces } from "./../actions/places";

class HomePage extends React.Component {
  static getInitialProps = async function({ reduxStore }) {
    const places = await getAllPlaces();
    const posts = await getAllPosts();
    reduxStore.dispatch(setPosts(posts))
    reduxStore.dispatch(setPlaces(places))
    return { };
  };

  render() {
    const { places, posts } = this.props;
    const breadcrumbLinks = [{ href: "/", text: "Home", active: true }];
    const googleMapsProps = {
      showWholeWorld: true,
      isMarkerShown: true,
      places
    };
    return (
      <Layout title={HOME_PAGE_TITLE} description={HOME_PAGE_DESCRIPTION}>
        <div className="content-container">
          <FilterableDataList
            searchBarPlaceHolder="Search"
            DataList={PostList}
            googleMapsProps={googleMapsProps}
            noDataText={"There is no post yet"}
            data={posts}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
          />
        </div>
      </Layout>
    );
  }
}
function mapStateToProps ({ posts, places }) {
  return { posts, places }
}

export default connect(mapStateToProps)(HomePage);
