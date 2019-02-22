import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";

import FilterablePostList from "../components/FilterablePostList";
import PageHeader from "./PageHeader";
import {
  NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT,
  HOME_PAGE_TITLE,
  HOME_PAGE_DESCRIPTION
} from "./../constants/constants";
import { setCountries } from "./../actions/countries";
import Layout from "./Layout";
import { getAllPosts } from "../queries/post";
import { getCountries } from "../queries/country";
import { setTextFilter } from "./../actions/filters";

export class HomePage extends React.Component {
  async componentDidMount() {
    const countries = await getCountries();
    this.props.dispatch(setCountries(countries));
    const searchQuery = Router.query.s;
    if (searchQuery) {
      this.props.dispatch(setTextFilter(searchQuery));
    }
  }

  render() {
    const { userName, posts, countries } = this.props;
    return (
      <Layout title={HOME_PAGE_TITLE} description={HOME_PAGE_DESCRIPTION}>
        <PageHeader title={`Welcome${userName ? `, ${userName}` : ""}`} />
        <div className="content-container">
          <Link href="/destinations">
            <a className="button mb1">Find Your Favourite Destinations</a>
          </Link>
          <FilterablePostList
            SearchBarAutoFocus={true}
            posts={posts}
            noPostText={NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT}
            withMap={false}
            withCountryFilter={false}
          />
        </div>
      </Layout>
    );
  }
}

HomePage.getInitialProps = async function() {
  const posts = await getAllPosts();
  return { posts };
};

const mapStateToProps = ({ auth }) => ({
  userName: auth.userName
});

export default connect(mapStateToProps)(HomePage);
