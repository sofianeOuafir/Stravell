import React from "react";
import { connect } from "react-redux";
import MultiDecorator from "draft-js-plugins-editor/lib/Editor/MultiDecorator";
import { CompositeDecorator } from "draft-js";
import { EditorState, convertFromRaw } from "draft-js";
import MyEditor, { plugins } from "./MyEditor";
import PageHeader from "./PageHeader";
import { getDateFormat } from "./../lib/utils/date";
import { Helmet } from "react-helmet";
import PostAuthor from './PostAuthor';

function getPluginDecorators() {
  let decorators = [];
  let plugin;
  for (plugin of plugins) {
      if (plugin.decorators !== null && plugin.decorators !== undefined) {
          decorators = decorators.concat(plugin.decorators);
      }
  }

  return new MultiDecorator([new CompositeDecorator(decorators)]);
}

const ShowPostPage = ({ post }) => {
  const body = EditorState.createWithContent(
    convertFromRaw(JSON.parse(post.body)),
    getPluginDecorators()
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
      <img src={`${post.image}`} alt="" className="fullwidth"/>
      <div className="content-container">
        <MyEditor readOnly editorState={body} onChange={() => {}} />
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  post: state.posts.find(post => post.id === props.match.params.id)
});

export default connect(mapStateToProps)(ShowPostPage);
