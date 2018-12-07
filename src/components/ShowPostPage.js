import React from "react";
import { connect } from "react-redux";
import { EditorState, convertFromRaw } from "draft-js";
import Avatar from "react-avatar";
import MyEditor from "./MyEditor";
import PageHeader from "./PageHeader";
import { getDateFormat } from "./../lib/utils/date";
import { Helmet } from "react-helmet";
import * as Constants from "./../constants/constants";

const ShowPostPage = ({ post }) => {
  const body = EditorState.createWithContent(
    convertFromRaw(JSON.parse(post.body))
  );
  return (
    <div>
      <Helmet>
        <title>{`${Constants.APP_NAME} | ${post.title}`}</title>
      </Helmet>
      <PageHeader className="page-header">
        <h1 className="favourite-font-weight m0">{post.title}</h1>
        <div className="flex align-items--center my1">
          <Avatar
            className="mr1"
            size="50"
            round={true}
            src={post.userPhotoURL}
          />
          <span>{post.userName}</span>
        </div>
        <span>{getDateFormat(post.createdAt)}</span>
      </PageHeader>
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
