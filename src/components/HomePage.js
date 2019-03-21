import React from "react";

import Layout from "./Layout";
import { getCountries } from "../queries/country";
import CountryList from "./CountryList";
import { getAllPlaces } from "./../queries/place";
import FilterableDataList from "./FilterableDataList";
import { getAllPosts } from "../queries/post";
import Banner from "./Banner";

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
        <Banner
          imageUrl="/static/images/home.svg"
          placeSuggestions={[
            "Thailand",
            "Australia",
            "Canada",
            "Japan",
            "Brazil"
          ]}
        />
        <div className="content-container">
          <FilterableDataList
            searchBarPlaceHolder="Search a destination. (Australia, Thailand...)"
            DataList={CountryList}
            googleMapsProps={googleMapsProps}
            noDataText={"There is no country yet."}
            data={countries}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
          />
          <h2 className="favourite-font-weight">Latest Posts</h2>
          <PostList noDataText={"There is no post yet."} data={posts} />
        </div>
      </Layout>
    );
  }
}

HomePage.getInitialProps = async function() {
  const countries = await getCountries();
  const places = await getAllPlaces();
  const posts = await getAllPosts(15);
  return { countries, places, posts };
};

export default HomePage;
