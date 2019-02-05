import React from "react";
import Link from "next/link";
import Router from "next/router";
import { connect } from 'react-redux';

import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import {
  NO_ELEMENT_POST_LIST_DASHBOARD_TEXT,
  DASHBOARD_PAGE_TITLE,
  DASHBOARD_PAGE_DESCRIPTION
} from "./../constants/constants";
import Layout from "./Layout";
import { setCountries } from "./../actions/countries";
import { setCountryFilter } from "./../actions/filters";
import { getPosts } from "../queries/post";
import { getCountries } from "../queries/countries";

export class DashboardPage extends React.Component {
  async componentDidMount() {
    const { uid } = this.props;
    const countries = await getCountries({ uid });
    this.props.dispatch(setCountries(countries));
    this.props.dispatch(setCountryFilter(''));
  }

  render() {
    const { posts } = this.props;
    return (
      <Layout
        title={DASHBOARD_PAGE_TITLE}
        description={DASHBOARD_PAGE_DESCRIPTION}
      >
        <PageHeader title="Dashboard" />
        <div className="content-container">
          <Link as="/p/create" href="/createPost">
            <a className="button button--with-bottom-margin">Create Post</a>
          </Link>
          <FilterablePostList
            editable={true}
            SearchBarAutoFocus={true}
            posts={posts}
            noPostText={NO_ELEMENT_POST_LIST_DASHBOARD_TEXT}
          />
        </div>
      </Layout>
    );
  }
}

DashboardPage.getInitialProps = async function({
  query,
  req,
  reduxStore,
  res
}) {
  const { uid } = query;
  let authorised = false;
  if (req && req.session.decodedToken) {
    const user = req.session.decodedToken;
    if (user.user_id == query.uid) {
      authorised = true;
    }
  } else {
    if (reduxStore.getState().auth.uid == uid) {
      authorised = true;
    }
  }
  if (authorised) {
    const posts = await getPosts({ uid })
    return { posts, uid };
  } else {
    if (res) {
      res.writeHead(302, {
        Location: "/"
      });
      res.end();
    } else {
      Router.push("/");
    }
  }
};

export default connect()(DashboardPage);
