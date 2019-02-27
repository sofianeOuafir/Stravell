import React from "react";
import { slugify } from "underscore.string";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import PageHeader from "./PageHeader";
import { getPlacePosts } from "../queries/post";
import { getPlace } from "../queries/place";
import Place from "./Place";
import { getRegionPlaces, getCountryPlaces } from "../queries/place";
import PostList from "./PostList";

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
      { href: "/", text: "Home" },
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
        text: address,
        active: true
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
          <FilterableDataList
            DataList={PostList}
            data={posts}
            noDataText={`There is no post about ${address} yet.`}
            googleMapsProps={{
              isMarkerShown: true,
              places,
              northEastLat: placeNorthEastLat,
              northEastLng: placeNorthEastLng,
              southWestLat: placeSouthWestLat,
              southWestLng: placeSouthWestLng
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

PlacePage.getInitialProps = async function({ query }) {
  const { id } = query;
  const place = await getPlace(id);
  const posts = await getPlacePosts(id);
  let places;
  if(place.regionCode){
    places = await getRegionPlaces(place.regionCode);
  } else {
    places = await getCountryPlaces(place.countryCode);
  }
  

  return { place, posts, places };
};

export default PlacePage;
