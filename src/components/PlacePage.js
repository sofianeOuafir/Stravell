import React from "react";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import { getPlacePosts } from "../queries/post";
import { getPlace } from "../queries/place";
import Place from "./Place";
import { getRegionPlaces } from "../queries/place";
import BreadCrumb from "./Breadcrumb";

class PlacePage extends React.Component {
  render() {
    const { place, posts, places } = this.props;
    const {
      id,
      address,
      country,
      countryCode,
      placeNorthEastLat,
      placeNorthEastLng,
      placeSouthWestLat,
      placeSouthWestLng,
      regionCode,
      region
    } = place;
    const breadcrumbLinks = [
      { href: "/destinations", text: "Destinations" },
      {
        href: `/country?countryCode=${countryCode}`,
        as: `/country/${countryCode}`,
        text: country
      },
      {
        href: `/region?regionCode=${regionCode}`,
        as: `/region/${slugify(country)}/${regionCode}`,
        text: region
      },
      {
        href: `/place?id=${id}`,
        as: `/place/${slugify(address)}/${id}`,
        text: address
      }
    ];
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
          <BreadCrumb links={breadcrumbLinks} />
          <FilterablePostList
            posts={posts}
            withCountryFilter={false}
            noPostText={`There is no post about ${address} yet.`}
            googleMapsProps={{
              isMarkerShown: true,
              places,
              northEastLat: placeNorthEastLat,
              northEastLng: placeNorthEastLng,
              southWestLat: placeSouthWestLat,
              southWestLng: placeSouthWestLng
            }}
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
  const places = await getRegionPlaces(place.regionCode);
  return { place, posts, places };
};

export default PlacePage;
