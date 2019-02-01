import React from "react";
import MultiDecorator from "draft-js-plugins-editor/lib/Editor/MultiDecorator";
import { EditorState, convertFromRaw, CompositeDecorator } from "draft-js";
import Head from "next/head";

import MyEditor, { plugins } from "./MyEditor";
import PageHeader from "./PageHeader";
import { getDateFormat } from "./../lib/utils/date";
import PostAuthor from "./PostAuthor";
import database from "./../firebase/firebase";
import Layout from "./Layout";
import Address from './Address';

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

export const ShowPostPage = ({ post }) => {
  const body = EditorState.createWithContent(
    convertFromRaw(JSON.parse(post.body)),
    getPluginDecorators()
  );
  return (
    <Layout withTitleAndDescription={false}>
      <Head>
        <title>{`${post.title}`}</title>
        <meta name="description" content={post.description} />
      </Head>
      <PageHeader>
        <h1 className="favourite-font-weight m0">{post.title}</h1>
        <div className="flex justify-content--between align-items--center">
          <div className="my1">
            <PostAuthor
              authorUid={post.uid}
              avatarSize={50}
              authorPhotoURL={post.userPhotoURL}
              authorName={post.userName}
            />
          </div>
          <span>{getDateFormat(post.createdAt)}</span>
        </div>
        <Address address={post.address} />
      </PageHeader>
      <img src={`${post.image}`} alt="" className="fullwidth" />
      <div className="content-container">
        <MyEditor readOnly={true} editorState={body} onChange={() => {}} />
      </div>
    </Layout>
  );
};

ShowPostPage.getInitialProps = async function(context) {
  const post = await new Promise((resolve, reject) => {
    const { id } = context.query;
    database.ref(`posts/${id}`).on("value", snapshot => {
      let post = { id: snapshot.key, ...snapshot.val() };
      resolve(post);
    });
  });
  return { post };
};

export default ShowPostPage;
