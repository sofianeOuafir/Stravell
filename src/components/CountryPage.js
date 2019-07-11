import React from "react";
import Link from "next/link";
import { slugify } from "underscore.string";
import { connect } from "react-redux";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import { getCountryPosts } from "../queries/post";
import { getAllPlaces } from "../queries/place";
import { getCountry } from "../queries/country";
import { getCountryRegions } from "../queries/region";
import PostList from "./PostList";
import { setPlaces } from "../actions/places";
import { setPosts } from "../actions/posts";

class CountryPage extends React.Component {
  static getInitialProps = async function({ query, reduxStore }) {
    const { countryCode } = query;
    const country = await getCountry(countryCode);
    const posts = await getCountryPosts({ countryCode });
    const places = await getAllPlaces();
    const regions = await getCountryRegions(countryCode);
    reduxStore.dispatch(setPlaces(places));
    reduxStore.dispatch(setPosts(posts));
    return { country, regions };
  };

  render() {
    const { posts, country, places, regions } = this.props;
    let regionsLink = {};
    const {
      country: countryName,
      countryNorthEastLat,
      countryNorthEastLng,
      countrySouthWestLat,
      countrySouthWestLng,
      id
    } = country;
    const googleMapsProps = {
      isMarkerShown: true,
      places,
      northEastLat: countryNorthEastLat,
      northEastLng: countryNorthEastLng,
      southWestLat: countrySouthWestLat,
      southWestLng: countrySouthWestLng
    };
    if (regions.length > 0) {
      regionsLink = {
        href: `/regions?countryCode=${id}`,
        as: `/${slugify(countryName)}/${id}/regions`,
        text: "Search By State / Region"
      };
    }
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/country?countryCode=${id}`,
        as: `/country/${id}`,
        text: countryName,
        active: true
      },
      regionsLink
    ];
    return (
      <Layout
        title={`Stravell | ${countryName}`}
        description={`Travel articles about ${countryName}`}
      >
        <div className="content-container">
          <FilterableDataList
            DataList={PostList}
            data={posts}
            noDataText={`There is no post about ${countryName} yet.`}
            googleMapsProps={googleMapsProps}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = ({ places, posts }) => ({
  places,
  posts
});

export default connect(mapStateToProps)(CountryPage);
