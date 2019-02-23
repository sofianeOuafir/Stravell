import React from "react";
import { connect } from "react-redux";
import Router from "next/router";

import FilterableDataList from "../components/FilterableDataList";
import PageHeader from "./PageHeader";
import {
  NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT,
  HOME_PAGE_TITLE,
  HOME_PAGE_DESCRIPTION
} from "./../constants/constants";
import Layout from "./Layout";
import { getAllPosts } from "../queries/post";
import { setTextFilter } from "./../actions/filters";
import { getAllPlaces } from "./../queries/place";
import PostList from "./PostList";

export class HomePage extends React.Component {
  async componentDidMount() {
    const searchQuery = Router.query.s;
    if (searchQuery) {
      this.props.dispatch(setTextFilter(searchQuery));
    }
  }

  render() {
    const { userName, posts, places } = this.props;
    const breadcrumbLinks = [
      { href: "/", text: "Home", active: true },
      {
        href: `/destinations`,
        text: "Destinations"
      }
    ];
    const googleMapsProps = {
      isMarkerShown: true,
      places,
      showWholeWorld: true
    };
    return (
      <Layout title={HOME_PAGE_TITLE} description={HOME_PAGE_DESCRIPTION}>
        <PageHeader title={`Welcome${userName ? `, ${userName}` : ""}`} />
        <div className="content-container">
          <FilterableDataList
            DataList={PostList}
            data={posts}
            noDataText={NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT}
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

HomePage.getInitialProps = async function() {
  const posts = await getAllPosts();
  const places = await getAllPlaces();
  return { posts, places };
};

const mapStateToProps = ({ auth }) => ({
  userName: auth.userName
});

export default connect(mapStateToProps)(HomePage);
