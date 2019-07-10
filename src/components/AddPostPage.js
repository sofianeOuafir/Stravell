import React from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { slugify } from "underscore.string";

import PostForm from "./PostForm";
import PageHeader from "./PageHeader";
import {
  ADD_POST_PAGE_TITLE,
  ADD_POST_PAGE_DESCRIPTION
} from "./../constants/constants";
import Layout from "./Layout";
import BreadCrumb from "./Breadcrumb";
import { addPost } from "./../queries/post";

class AddPostPage extends React.Component {
  static getInitialProps = async function({ currentUser }) {
    return { isPrivate: true, allowAccess: !!currentUser };
  };

  onSubmit = ({ post, country, user, place, region }) => {
    const { addPost } = this.props;
    addPost({ post, country, user, place, region, addToTweetQueue: true }).then(
      () => {
        this.props.router.push(
          `/dashboard`
        );
      }
    );
  };

  render() {
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/dashboard`,
        text: "Dashboard"
      },
      {
        href: `/create`,
        as: "/p/create",
        text: "Create Post",
        active: true
      }
    ];
    return (
      <Layout
        title={ADD_POST_PAGE_TITLE}
        description={ADD_POST_PAGE_DESCRIPTION}
      >
        <PageHeader title="Create Post" withSocialShareButtons={false} />
        <div className="content-container">
          <div className="mb1">
            <BreadCrumb links={breadcrumbLinks} />
          </div>

          <PostForm onSubmit={this.onSubmit} />
        </div>
      </Layout>
    );
  }
}

const mapDispatchToProps = () => ({
  addPost: params => {
    return addPost(params);
  }
});

export { AddPostPage };

export default connect(
  null,
  mapDispatchToProps
)(withRouter(AddPostPage));
