import React from "react";

import Layout from "./Layout";
import PageHeader from "./PageHeader";
import { getCountries } from "../queries/country";
import CountryList from "./CountryList";
import { getAllPlaces } from "./../queries/place";
import FilterableDataList from "./FilterableDataList";
import { getAllPosts } from "../queries/post";
import SocialShareButtons from "./SocialShareButtons";
import { IoIosSearch } from "react-icons/io";
import Typed from 'react-typed';

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
        <div className="homepage__image-container">
          <div className="content-container">
            <div className="homepage__image-container__text-container" />
            <div className="homepage__image-container__text">
              <h1 className="homepage__image-container__text--website-name">
                Stravell
              </h1>
              A search engine for travel articles. <br /> It makes it easy for
              you to find travel articles about thousands of places
              <br />
              around the world written by some of the best travel bloggers
              worldwide.
            </div>
            <div className="homepage__image-container__typing-container" />
            <div className="homepage__image-container__typing flex align-items--center">
              <IoIosSearch className="mr1" />
              <Typed 
              strings={[
                  'Thailand',
                  'Australia',
                  'Canada',
                  'Japan',
                  'Brazil']}
                  typeSpeed={100}
                  backSpeed={100} 
                  loop >
              </Typed>
            </div>

            <div className="homepage__image-container__social_buttons">
              <SocialShareButtons />
            </div>
          </div>

          <img src="/static/images/home.svg" alt="" className="fullwidth" />
        </div>
        <div className="content-container">
          <FilterableDataList
            searchBarPlaceHolder="Search a country. Click on it. Start reading :)"
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
