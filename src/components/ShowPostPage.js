import React from 'react';
import { connect } from 'react-redux';

const ShowPostPage = (props) => (
  <div>
    <h1>{props.post.title}</h1>
    <p>
      {props.post.body}
    </p>
  </div>
);

const mapStateToProps = (state, props) => ({
  post: state.posts.find(post => post.id === props.match.params.id)
});

export default connect(mapStateToProps)(ShowPostPage);