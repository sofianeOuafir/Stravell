import React, { Fragment } from "react";
import Router from "next/router";
import { slugify } from "underscore.string";
import { connect } from 'react-redux';

import FilterableDataList from "./FilterableDataList";
import PageHeader from "./PageHeader";
import {
  NO_ELEMENT_POST_LIST_DASHBOARD_TEXT,
  DASHBOARD_PAGE_TITLE,
  DASHBOARD_PAGE_DESCRIPTION
} from "./../constants/constants";
import Layout from "./Layout";
import { getUserPosts } from "../queries/post";
import PostList from "./PostList";
import AvatarEditor from "./AvatarEditor";
import { setPosts } from "./../actions/posts";

export class DashboardPage extends React.Component {
  static getInitialProps = async function({ reduxStore, currentUser }) {
    let uid;
    let posts = [];
    const allowAccess = !!currentUser;
    try {
      uid = currentUser.uid;
      posts = await getUserPosts({ uid, onlyPublished: false });
      reduxStore.dispatch(setPosts(posts));
    } catch (error) {}

    return { currentUser, isPrivate: true, allowAccess };
  };

  render() {
    const { posts, currentUser } = this.props;
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/dashboard`,
        text: "Dashboard",
        active: true
      },
      { href: "/create", as: "/p/create", text: "Create Post" }
    ];
    return (
      <Layout
        title={DASHBOARD_PAGE_TITLE}
        description={DASHBOARD_PAGE_DESCRIPTION}
      >
        <PageHeader withSocialShareButtons={false}>
          <div className="flex align-items--center">
            <AvatarEditor user={currentUser} />
            <span className="ml2 favourite-font-weight h2">Dashboard</span>
          </div>
        </PageHeader>
        <div className="content-container">
          <FilterableDataList
            DataList={PostList}
            withMap={false}
            editable={true}
            data={posts}
            nodataText={NO_ELEMENT_POST_LIST_DASHBOARD_TEXT}
            breadCrumbProps={{
              links: breadcrumbLinks
            }}
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = ({ posts }) => ({
  posts
})

export default connect(mapStateToProps)(DashboardPage);
