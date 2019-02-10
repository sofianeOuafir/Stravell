import React from "react";
import PostForm from "./PostForm";
import { connect } from "react-redux";
import Router, { withRouter } from 'next/router';
import { slugify } from 'underscore.string';

import { startEditPost } from '../actions/posts';
import PageHeader from './PageHeader';
import { EDIT_POST_PAGE_DESCRIPTION, EDIT_POST_PAGE_TITLE } from './../constants/constants';
import Layout from "./Layout";
import { getPost } from "../queries/post";
export class EditPostPage extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit = ({ post, postBeforeUpdate }) => {
    this.props.startEditPost({
      id: this.props.post.id, 
      updates: post,
      postBeforeUpdate
    });
    this.props.router.push(`/dashboard?uid=${this.props.uid}`, `/dashboard/${slugify(this.props.userName)}/${this.props.uid}`)
  };

  render() {
    return (
      <Layout title={EDIT_POST_PAGE_TITLE} description={EDIT_POST_PAGE_DESCRIPTION}>
        <PageHeader title="Edit Post" />
        <div className="content-container">
          <PostForm post={this.props.post} onSubmit={this.onSubmit}  />
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
    if( res ) {
      res.writeHead(302, {
        Location: '/'
      });
      res.end()
    }
    else {
      Router.push('/')
    }
  }
};

const mapDispatchToProps = (dispatch) => ({
  startEditPost: ({ id, updates, postBeforeUpdate }) => {
    dispatch(startEditPost({
      id, 
      updates,
      postBeforeUpdate
    }));
  }
});

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  userName: state.auth.userName
});



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditPostPage));
