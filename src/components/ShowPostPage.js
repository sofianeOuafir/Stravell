import React from "react";
import { connect } from "react-redux";
import { EditorState, convertFromRaw } from "draft-js";
import MyEditor from "./MyEditor";
import PageHeader from "./PageHeader";
import { getDateFormat } from "./../lib/utils/date";
import { Helmet } from "react-helmet";
import PostAuthor from './PostAuthor';

const ShowPostPage = ({ post }) => {
  const body = EditorState.createWithContent(
    convertFromRaw(JSON.parse(post.body))
  );
  return (
    <div>
      <Helmet>
        <title>{`${post.title}`}</title>
      </Helmet>
      <PageHeader>
        <h1 className="favourite-font-weight m0">{post.title}</h1>
        <div className="my1">
          <PostAuthor
            authorUid={post.uid}
            avatarSize={50}
            authorPhotoURL={post.userPhotoURL}
            authorName={post.userName}
          />
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
