import React from "react";
import { slugify } from "underscore.string";
import { connect } from "react-redux";

import Layout from "./Layout";
import FilterableDataList from "./FilterableDataList";
import { getRegion } from "../queries/region";
import { getRegionPosts } from "../queries/post";
import { getAllPlaces } from "../queries/place";
import PostList from "./PostList";
import { setPosts } from "./../actions/posts";
import { setPlaces } from "./../actions/places";

class RegionPage extends React.Component {
  static getInitialProps = async function({ query, reduxStore }) {
    const { regionCode } = query;
    const region = await getRegion(regionCode);
    const posts = await getRegionPosts({ regionCode });
    const places = await getAllPlaces();
    reduxStore.dispatch(setPosts(posts));
    reduxStore.dispatch(setPlaces(places));

    return { region };
  };

  render() {
    const { posts, region, places } = this.props;
    const {
      region: regionName,
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
      {
        href: `/country?countryCode=${countryCode}`,
        as: `/country/${countryCode}`,
        text: country
      },
      {
        href: `/region?regionCode=${id}`,
        as: `/region/${slugify(country)}/${id}`,
        text: regionName,
        active: true
      }
    ];
    return (
      <Layout
        title={`Stravell | ${regionName}`}
        description={`Travel articles about ${regionName}`}
      >
        <div className="content-container">
          <FilterableDataList
            DataList={PostList}
            data={posts}
            noDataText={`There is no post about ${regionName} yet.`}
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

const mapStateToProps = ({ posts, places }) => ({
  posts,
  places
});

export default connect(mapStateToProps)(RegionPage);
