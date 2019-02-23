import React from "react";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import PageHeader from "./PageHeader";
import { getRegion } from "../queries/region";
import { getRegionPosts } from "../queries/post";
import { getRegionPlaces } from "../queries/place";
import Place from "./Place";

class RegionPage extends React.Component {
  render() {
    const { posts, region, places } = this.props;
    const {
      regionNorthEastLat,
      regionNorthEastLng,
      regionSouthWestLat,
      regionSouthWestLng,
      country,
      countryCode,
      id
    } = region;
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      { href: "/destinations", text: "Destinations" },
      {
        href: `/country?countryCode=${countryCode}`,
        as: `/country/${countryCode}`,
        text: country
      },
      {
        href: `/region?regionCode=${id}`,
        as: `/region/${slugify(country)}/${id}`,
        text: region.region,
        active: true
      }
    ];
    return (
      <Layout
        title={`Stravell | ${region.region}`}
        description={`Travel articles about ${region.region}`}
      >
        <PageHeader>
          <Place
            placeName={region.region}
            countryCode={countryCode}
            placeNameClassName="h2 favourite-font-weight"
            flagSize="64"
          />
        </PageHeader>
        <div className="content-container">
          <FilterableDataList
            posts={posts}
            noPostText={`There is no post about ${region.region} yet.`}
            googleMapsProps={{
              isMarkerShown: true,
              places,
              northEastLat: regionNorthEastLat,
              northEastLng: regionNorthEastLng,
              southWestLat: regionSouthWestLat,
              southWestLng: regionSouthWestLng
            }}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
          />
        </div>
      </Layout>
    );
  }
}

RegionPage.getInitialProps = async function({ query }) {
  const { regionCode } = query;
  const region = await getRegion(regionCode);
  const posts = await getRegionPosts(regionCode);
  const places = await getRegionPlaces(regionCode);
  return { posts, region, places };
};

export default RegionPage;
