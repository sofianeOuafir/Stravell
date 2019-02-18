import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'next/router';
import { slugify } from 'underscore.string';

import PostForm from "./PostForm";
import { startAddPost } from "../actions/posts";
import PageHeader from './PageHeader';
import { ADD_POST_PAGE_TITLE, ADD_POST_PAGE_DESCRIPTION } from './../constants/constants';
import Layout from "./Layout";

export class AddPostPage extends React.Component {
  onSubmit = post => {
    this.props.startAddPost(post);
    this.props.router.push(`/dashboard?uid=${this.props.uid}`, `/dashboard/${slugify(this.props.userName)}/${this.props.uid}`)
  };

  render() {
    return (
      <Layout title={ADD_POST_PAGE_TITLE} description={ADD_POST_PAGE_DESCRIPTION}>
        <PageHeader title="Create Post" withSocialShareButtons={false} />
        <div className="content-container">
          <PostForm onSubmit={this.onSubmit} /> 
        </div>
      </Layout>
    );
  }
}



AddPostPage.getInitialProps = async function({ req, reduxStore, res }) {
  let authorised = false;
  if (req && req.session) {
    const user = req.session.decodedToken;
    if (user) {
      authorised = true;
    }
  } else {
    if (reduxStore.getState().auth.uid) {
      authorised = true;
    }
  }

  if (authorised) {
    return { };
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

const mapDispatchToProps = dispatch => ({
  startAddPost: post => {
    dispatch(startAddPost(post));
  }
});

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  userName: state.auth.userName
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddPostPage));
