import React from "react";
import Router from "next/router";
import { connect } from 'react-redux';
import { slugify } from 'underscore.string';

import FilterableDataList from "./FilterableDataList";
import PageHeader from "./PageHeader";
import {
  NO_ELEMENT_POST_LIST_DASHBOARD_TEXT,
  DASHBOARD_PAGE_TITLE,
  DASHBOARD_PAGE_DESCRIPTION
} from "./../constants/constants";
import Layout from "./Layout";
import { setCountries } from "./../actions/countries";
import { getUserPosts } from "../queries/post";
import { getUser } from "../queries/user";

export class DashboardPage extends React.Component {
  render() {
    const { posts, user } = this.props;
    const { id, userName } = user;
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      { href: "/dashboard", as: `/dashboard/${slugify(userName)}/${id}`, text: "Dashboard", active: true },
      { href: "/create", as: '/p/create', text: 'Create Post' }
    ];
    return (
      <Layout
        title={DASHBOARD_PAGE_TITLE}
        description={DASHBOARD_PAGE_DESCRIPTION}
      >
        <PageHeader title="Dashboard" withSocialShareButtons={false} />
        <div className="content-container">
          <FilterableDataList
            withMap={false}
            editable={true}
            SearchBarAutoFocus={true}
            posts={posts}
            noPostText={NO_ELEMENT_POST_LIST_DASHBOARD_TEXT}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
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
    const posts = await getUserPosts(uid)
    const user = await getUser(uid)
    return { posts, user };
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
