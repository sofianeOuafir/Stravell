import React from 'react';
import { connect } from 'react-redux';
import {Editor} from 'draft-js';
import PageHeader from './PageHeader';

const ShowPostPage = (props) => (
  <div>
    <PageHeader title={props.post.title} />
    <div className="content-container">
      <Editor readOnly={true} editorState={props.post.body} ></Editor>
    </div>
  </div>
);

const mapStateToProps = (state, props) => ({
  post: state.posts.find(post => post.id === props.match.params.id)
});

export default connect(mapStateToProps)(ShowPostPage);