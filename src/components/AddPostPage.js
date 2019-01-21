import React from "react";
import { connect } from "react-redux";
import { withRouter } from 'next/router';

import PostForm from "./PostForm";
import { startAddPost } from "../actions/posts";
import PageHeader from './PageHeader';
import page from './../hocs/page';
import { ADD_POST_PAGE_TITLE, ADD_POST_PAGE_DESCRIPTION } from './../constants/constants';

export class AddPostPage extends React.Component {
  onSubmit = post => {
    this.props.startAddPost(post);
    this.props.router.push("/dashboard");
  };

  render() {
    return (
      <div>
        <PageHeader title="Create Post" />
        <div className="content-container">
          <PostForm onSubmit={this.onSubmit} /> 
        </div>
      </div>
    );
  }
}

const Component = page(withRouter(AddPostPage), { title: ADD_POST_PAGE_TITLE, description: ADD_POST_PAGE_DESCRIPTION });

Component.getInitialProps = async function({ req, reduxStore, res }) {
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

export default connect(
  undefined,
  mapDispatchToProps
)(Component);
