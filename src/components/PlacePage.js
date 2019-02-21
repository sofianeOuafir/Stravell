import React from "react";

import Layout from "./Layout";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import { getPlacePosts } from "../queries/post";
import { getPlace } from "../queries/place";
import Place from "./Place";
import GoogleMaps from "./GoogleMaps";

class PlacePage extends React.Component {
  render() {
    const { place, posts } = this.props;
    const {
      address,
      countryCode,
      placeNorthEastLat,
      placeNorthEastLng,
      placeSouthWestLat,
      placeSouthWestLng
    } = place;
    return (
      <Layout
        title={`Stravell | ${address}`}
        description={`Travel articles about ${address}`}
      >
        <PageHeader>
          <Place
            placeName={address}
            countryCode={countryCode}
            placeNameClassName="h2 favourite-font-weight"
            flagSize="64"
          />
        </PageHeader>
        <div className="content-container">
          <GoogleMaps
            northEastLat={placeNorthEastLat}
            northEastLng={placeNorthEastLng}
            southWestLat={placeSouthWestLat}
            southWestLng={placeSouthWestLng}
          />
          <FilterablePostList
            posts={posts}
            withCountryFilter={false}
            noPostText={`There is no post about ${address} yet.`}
          />
        </div>
      </Layout>
    );
  }
}

PlacePage.getInitialProps = async function({ query }) {
  const { id } = query;
  const place = await getPlace(id);
  const posts = await getPlacePosts(id);
  return { place, posts };
};

export default PlacePage;
