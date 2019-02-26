import React from "react";
import PostForm from "./PostForm";
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";
import { slugify } from "underscore.string";

import { startEditPost } from "../actions/posts";
import PageHeader from "./PageHeader";
import {
  EDIT_POST_PAGE_DESCRIPTION,
  EDIT_POST_PAGE_TITLE
} from "./../constants/constants";
import Layout from "./Layout";
import { getPost } from "../queries/post";
import BreadCrumb from "./Breadcrumb";
export class EditPostPage extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit = ({ postData }) => {
    const postBeforeUpdate = this.props.post;
    if(postData.countryCode !== postBeforeUpdate.countryCode){
      // addOrUpdatePost({ postId, postData })
      data[`posts/${postBeforeUpdate.id}/countryCode`] = postData.countryCode;
      if(postBeforeUpdate.countryCode){
        // removeCountryPost({ countryCode, postId })
        data[`country-posts/${postBeforeUpdate.countryCode}/${postBeforeUpdate.id}`] = null;
      }

      if(postData.countryCode) {
        // addOrUpdate countryPost({ countryCode, postId, postData })
        data[`country-posts/${postData.countryCode}/${postBeforeUpdate.id}`] = postData;
      }
    }

    this.props.startEditPost({
      id: this.props.post.id,
      updates: post,
      postBeforeUpdate
    });
    this.props.router.push(
      `/dashboard?uid=${this.props.uid}`,
      `/dashboard/${slugify(this.props.userName)}/${this.props.uid}`
    );
  };

  render() {
    const { post, userName, uid } = this.props;
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/dashboard/${slugify(userName)}/${uid}`,
        text: "Dashboard"
      },
      {
        href: `/editPost?id=${post.id}`,
        as: `/p/edit/${slugify(post.title)}/${post.id}`,
        text: "Edit Post",
        active: true
      }
    ];
    return (
      <Layout
        title={EDIT_POST_PAGE_TITLE}
        description={EDIT_POST_PAGE_DESCRIPTION}
      >
        <PageHeader title="Edit Post" withSocialShareButtons={false} />
        <div className="content-container">
          <div className="mb1">
            <BreadCrumb links={breadcrumbLinks} />
          </div>

          <PostForm post={post} onSubmit={this.onSubmit} />
        </div>
      </Layout>
    );
  }
}

EditPostPage.getInitialProps = async function({ query, req, reduxStore, res }) {
  const { id } = query;
  const post = await getPost(id);

  let authorised = false;
  if (req && req.session.decodedToken) {
    const user = req.session.decodedToken;
    if (user.user_id === post.uid) {
      authorised = true;
    }
  } else {
    if (reduxStore.getState().auth.uid === post.uid) {
      authorised = true;
    }
  }

  if (authorised) {
    return { post };
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

const mapDispatchToProps = dispatch => ({
  startEditPost: ({ id, updates, postBeforeUpdate }) => {
    dispatch(
      startEditPost({
        id,
        updates,
        postBeforeUpdate
      })
    );
  }
});

const mapStateToProps = state => ({
  uid: state.auth.uid,
  userName: state.auth.userName
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditPostPage));
