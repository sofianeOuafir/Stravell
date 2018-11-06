import React from "react";
import { connect } from "react-redux";
import { EditorState, convertFromRaw } from "draft-js";
import MyEditor from "./MyEditor";
import PageHeader from "./PageHeader";

const ShowPostPage = ({ post }) => {
  const body = EditorState.createWithContent(convertFromRaw(JSON.parse(post.body)));
  return (
    <div>
      <PageHeader title={post.title} />
      <div className="content-container">
        <MyEditor readOnly={true} editorState={body} onChange={() => {}} />
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  post: state.posts.find(post => post.id === props.match.params.id)
});

export default connect(mapStateToProps)(ShowPostPage);
