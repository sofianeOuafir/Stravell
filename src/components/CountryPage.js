import React from "react";
import Link from "next/link";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import PageHeader from "./PageHeader";
import { getCountryPosts } from "../queries/post";
import { getCountryRegions } from "../queries/region";
import { getCountryPlaces } from "../queries/place";
import { getCountry } from "../queries/country";
import Place from "./Place";
import { setCountryFilter } from "../actions/filters";
import { connect } from "react-redux";

class CountryPage extends React.Component {
  componentDidMount() {
    this.props.dispatch(setCountryFilter(""));
  }
  render() {
    const { posts, country, places, regions } = this.props;
    const {
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
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      { href: "/destinations", text: "Destinations" },
      {
        href: `/country?countryCode=${id}`,
        as: `/country/${id}`,
        text: country.country,
        active: true
      }
    ];
    return (
      <Layout
        title={`Stravell | ${country.country}`}
        description={`Travel articles about ${country.country}`}
      >
        <PageHeader>
          <Place
            placeName={country.country}
            countryCode={id}
            placeNameClassName="h2 favourite-font-weight"
            flagSize="64"
          />
        </PageHeader>
        <div className="content-container">
          <FilterableDataList
            posts={posts}
            noPostText={`There is no post about ${country.country} yet.`}
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

CountryPage.getInitialProps = async function({ query }) {
  const { countryCode } = query;
  const country = await getCountry(countryCode);
  const posts = await getCountryPosts(countryCode);
  const places = await getCountryPlaces(countryCode);
  const regions = await getCountryRegions(countryCode);
  return { posts, country, places, regions };
};

export default connect()(CountryPage);
