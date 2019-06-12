import React from "react";

import Layout from "./Layout";
import { getCountries } from "../queries/country";
import CountryList from "./CountryList";
import { getAllPlaces } from "./../queries/place";
import FilterableDataList from "./FilterableDataList";
import { getAllPosts } from "../queries/post";

import { HOME_PAGE_TITLE, HOME_PAGE_DESCRIPTION } from "../constants/constants";
import PostList from "./PostList";
class HomePage extends React.Component {
  render() {
    const { countries, places, posts } = this.props;
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

HomePage.getInitialProps = async function() {
  const countries = await getCountries();
  const places = await getAllPlaces();
  const posts = await getAllPosts();
  return { countries, places, posts };
};

export default HomePage;
