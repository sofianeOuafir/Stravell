import React from 'react';
import { connect } from 'react-redux';
import {Editor} from 'draft-js';

const ShowPostPage = (props) => (
  <div>
    <h1>{props.post.title}</h1>
    <Editor readOnly={true} editorState={props.post.body} ></Editor>
  </div>
);

const mapStateToProps = (state, props) => ({
  post: state.posts.find(post => post.id === props.match.params.id)
});

export default connect(mapStateToProps)(ShowPostPage);