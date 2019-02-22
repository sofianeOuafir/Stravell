import React from "react";
import Link from "next/link";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import { getCountryPosts } from "../queries/post";
import { getCountryRegions } from "../queries/region";
import { getCountryPlaces } from "../queries/place";
import { getCountry } from "../queries/country";
import Place from "./Place";
import { setCountryFilter } from "../actions/filters";
import { connect } from "react-redux";
import BreadCrumb from "./Breadcrumb";

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
    const breadcrumbLinks = [
      { href: "/destinations", text: "Destinations" },
      {
        href: `/country?countryCode=${id}`,
        as: `/country/${id}`,
        text: country.country
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
          <BreadCrumb links={breadcrumbLinks} />
          <FilterablePostList
            posts={posts}
            withCountryFilter={false}
            noPostText={`There is no post about ${country.country} yet.`}
            googleMapsProps={{
              isMarkerShown: true,
              places,
              northEastLat: countryNorthEastLat,
              northEastLng: countryNorthEastLng,
              southWestLat: countrySouthWestLat,
              southWestLng: countrySouthWestLng
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
