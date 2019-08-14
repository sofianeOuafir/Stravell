import React from "react";
import { slugify } from "underscore.string";
import { connect } from "react-redux";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import { getPlacePosts } from "../queries/post";
import { getPlace } from "../queries/place";
import { getAllPlaces } from "../queries/place";
import PostList from "./PostList";
import { setPosts } from "./../actions/posts";
import { setPlaces } from "./../actions/places";

class PlacePage extends React.Component {
  static getInitialProps = async function({ query, reduxStore }) {
    const { id } = query;
    const place = await getPlace(id);
    const posts = await getPlacePosts({ id });
    let places = await getAllPlaces();
    reduxStore.dispatch(setPosts(posts));
    reduxStore.dispatch(setPlaces(places));

    return { place };
  };

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
        <div className="content-container">
          <FilterableDataList
            DataList={PostList}
            data={posts}
            noDataText={`Be the first to write about ${address}!`}
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

const mapStateToProps = ({ places, posts }) => ({
  places,
  posts
});

export default connect(mapStateToProps)(PlacePage);
