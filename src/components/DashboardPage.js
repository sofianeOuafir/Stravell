import React, { Fragment } from "react";
import Router from "next/router";
import { slugify } from "underscore.string";

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

export class DashboardPage extends React.Component {
  static getInitialProps = async function({ query, reduxStore, currentUser }) {
    let uid;
    if(currentUser) {
      uid = currentUser.uid;
    }
    const posts = await getUserPosts({ uid, onlyPublished: false });
    return { posts, currentUser, isPrivate: true };
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

export default DashboardPage;
