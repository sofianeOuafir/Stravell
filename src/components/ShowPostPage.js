import React from "react";
import {withRouter} from 'next/router';
import MultiDecorator from "draft-js-plugins-editor/lib/Editor/MultiDecorator";
import { EditorState, convertFromRaw, CompositeDecorator } from "draft-js";
import Head from 'next/head';

import MyEditor, { plugins } from "./MyEditor";
import PageHeader from "./PageHeader";
import { getDateFormat } from "./../lib/utils/date";
import PostAuthor from './PostAuthor';
import database from "./../firebase/firebase";
import page from './../hocs/page';

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

export const ShowPostPage = page(withRouter(({ post }) => {
  const body = EditorState.createWithContent(
    convertFromRaw(JSON.parse(post.body)),
    getPluginDecorators()
  );
  return (
    <div>
      <Head>
        <title>{`${post.title}`}</title>
        <meta name="description" content={post.description} />
      </Head>
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
}), { title: 'yoo', description: 'yoo' });

ShowPostPage.getInitialProps = async function(context) {
  const post = await new Promise((resolve, reject) => {
    const { id } = context.query;
    database
    .ref(`posts/${id}`)
    .on("value", snapshot => {
      let post = { id: snapshot.key, ...snapshot.val() } ;
      resolve(post);
    });
  });
  return { post };
};

// const mapStateToProps = (state, props) => ({
//   post: state.posts.find(post => post.id === props.id) 
// });

export default ShowPostPage;
