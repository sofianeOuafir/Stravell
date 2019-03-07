import React from "react";

import Layout from "./Layout";
import PageHeader from "./PageHeader";
import { getCountries } from "../queries/country";
import CountryList from "./CountryList";
import { getAllPlaces } from "./../queries/place";
import FilterableDataList from "./FilterableDataList";
import { getAllPosts } from "../queries/post";
import SocialShareButtons from "./SocialShareButtons";

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
        <div style={{ marginTop: 60 }} className="relative">
          <p
            className="absolute content-container favourite-font-weight"
            style={{ top: 60, color: "white", fontSize: 30 }}
          >
            Stravell is a search engine for travel articles. We make it easy for
            you to find travel articles about thousands of places around the
            world written by the best travel bloggers.
          </p>
          <div className="absolute content-container bg-white" style={{ bottom: 20}}>
            <SocialShareButtons />
          </div>
          <img src="/static/images/home.svg" alt="" className="fullwidth" />
        </div>
        <div className="content-container">
          <FilterableDataList
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
