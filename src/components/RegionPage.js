import React from "react";

import Layout from "./Layout";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import { getRegion } from '../queries/region';
import { getRegionPosts } from "../queries/post";
import { getRegionPlaces } from "../queries/place";
import Place from "./Place";
import GoogleMaps from "./GoogleMaps";

class RegionPage extends React.Component {
  render() {
    const { posts, region, places } = this.props;
    const {
      regionNorthEastLat,
      regionNorthEastLng,
      regionSouthWestLat,
      regionSouthWestLng,
      country
    } = region;
    return (
      <Layout
        title={`Stravell | ${region.region}`}
        description={`Travel articles about ${region.region}`}
      >
        <PageHeader>
          <Place
            placeName={region.region}
            countryCode={country}
            placeNameClassName="h2 favourite-font-weight"
            flagSize="64"
          />
        </PageHeader>
        <div className="content-container">
          <GoogleMaps
            isMarkerShown
            places={places}
            northEastLat={regionNorthEastLat}
            northEastLng={regionNorthEastLng}
            southWestLat={regionSouthWestLat}
            southWestLng={regionSouthWestLng}
          />
          <FilterablePostList
            posts={posts}
            withCountryFilter={false}
            noPostText={`There is no post about ${region.region} yet.`}
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
