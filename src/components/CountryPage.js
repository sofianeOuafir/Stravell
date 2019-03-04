import React from "react";
import Link from "next/link";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import PageHeader from "./PageHeader";
import { getCountryPosts } from "../queries/post";
import { getCountryPlaces } from "../queries/place";
import { getCountry } from "../queries/country";
import { getCountryRegions } from "../queries/region";
import Place from "./Place";
import PostList from "./PostList";

class CountryPage extends React.Component {
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
        text: "Search By State/Region"
      };
    }
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      { href: "/destinations", text: "Destinations" },
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
        <PageHeader>
          <Place
            placeName={countryName}
            countryCode={id}
            placeNameClassName="h2 favourite-font-weight"
            flagSize="64"
          />
        </PageHeader>
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

CountryPage.getInitialProps = async function({ query }) {
  const { countryCode } = query;
  const country = await getCountry(countryCode);
  const posts = await getCountryPosts(countryCode);
  const places = await getCountryPlaces(countryCode);
  const regions = await getCountryRegions(countryCode);
  return { posts, country, places, regions };
};

export default CountryPage;
