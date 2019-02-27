import React from "react";
import PostForm from "./PostForm";
import { connect } from "react-redux";
import Router, { withRouter } from "next/router";
import { slugify } from "underscore.string";

import PageHeader from "./PageHeader";
import {
  EDIT_POST_PAGE_DESCRIPTION,
  EDIT_POST_PAGE_TITLE
} from "./../constants/constants";
import Layout from "./Layout";
import { getPost } from "../queries/post";
import BreadCrumb from "./Breadcrumb";
import { addPost, removePost } from "./../queries/post";

export class EditPostPage extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit = ({ post, country, user, place, region }) => {
    const { post: postBeforeUpdate, uid, userName } = this.props;

    removePost(postBeforeUpdate)
      .then(() => {
        return addPost({ post, country, user, place, region });
      })
      .then(() => {
        this.props.router.push(
          `/dashboard?uid=${uid}`,
          `/dashboard/${slugify(userName)}/${uid}`
        );
      });
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

const mapStateToProps = state => ({
  uid: state.auth.uid,
  userName: state.auth.userName
});

export default connect(mapStateToProps)(withRouter(EditPostPage));
