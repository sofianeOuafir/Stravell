import React from "react";
import PostForm from "./PostForm";
import { connect } from "react-redux";
import Router, { withRouter } from 'next/router';

import { startEditPost } from '../actions/posts';
import PageHeader from './PageHeader';
import database from "./../firebase/firebase";
import page from '../hocs/page';
import { DASHBOARD_PAGE_TITLE, DASHBOARD_PAGE_DESCRIPTION } from './../constants/constants';

export class EditPostPage extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit = (post) => {
    this.props.startEditPost({
      id: this.props.post.id, 
      updates: post
    });
    this.props.router.push('/dashboard')
  };

  render() {
    return (
      <div>
        <PageHeader title="Edit Post" />
        <div className="content-container">
          <PostForm post={this.props.post} onSubmit={this.onSubmit}  />
        </div>
      </div>
    );
  }
}

const Component = page(withRouter(EditPostPage), { title: DASHBOARD_PAGE_TITLE, description: DASHBOARD_PAGE_DESCRIPTION });

Component.getInitialProps = async function({ query, req, reduxStore, res }) {
  const post = await new Promise((resolve, reject) => {
    const { id } = query;
    database
    .ref(`posts/${id}`)
    .on("value", snapshot => {
      let post = { id: snapshot.key, ...snapshot.val() } ;
      resolve(post);
    });
  });

  let authorised = false;
  if (req && req.session) {
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
  startEditPost: ({ id, updates }) => {
    dispatch(startEditPost({
      id, 
      updates
    }));
  }
});



export default connect(null, mapDispatchToProps)(Component);
