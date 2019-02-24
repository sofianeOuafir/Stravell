import React from "react";
import MultiDecorator from "draft-js-plugins-editor/lib/Editor/MultiDecorator";
import { EditorState, convertFromRaw, CompositeDecorator } from "draft-js";
import { slugify } from "underscore.string";

import MyEditor, { plugins } from "./MyEditor";
import PageHeader from "./PageHeader";
import { getDateFormat } from "./../lib/utils/date";
import PostAuthor from "./PostAuthor";
import Layout from "./Layout";
import Address from "./Address";
import { getPost } from "../queries/post";
import BreadCrumb from "./Breadcrumb";

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
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    {
      href: `/country?countryCode=${post.countryCode}`,
      as: `/country/${post.countryCode}`,
      text: post.country
    },
    {
      href: `/region?regionCode=${post.regionCode}`,
      as: `/region/${post.regionCode}`,
      text: post.region
    },
    {
      href: `/post?id=${post.id}`,
      as: `/p/show/${slugify(post.title)}/${post.id}`,
      text: post.title,
      active: true
    }
  ];
  const postImage = <img src={`${post.image}`} alt="" className="fullwidth" />;
  return (
    <Layout title={`${post.title}`} description={post.description}>
      <PageHeader>
        <h1 className="favourite-font-weight m0">{post.title}</h1>
        <div className="my1 flex justify-content--between align-items--center">
          <PostAuthor
            authorUid={post.uid}
            avatarSize={50}
            authorPhotoURL={post.userPhotoURL}
            authorName={post.userName}
          />

          <span>{getDateFormat(post.createdAt)}</span>
        </div>
        {post.address && (
          <Address
            address={post.address}
            lat={post.lat}
            lng={post.lng}
            iconClassName="ml1 mr1"
          />
        )}
      </PageHeader>
      <div className="content-container">
        <div className="mb1">
          <BreadCrumb links={breadcrumbLinks} />
        </div>
      </div>
      {post.provideURL ? (
        <div className="relative flex align-items--center justify-content--center">
          <a
            href={post.providedURL}
            className="button absolute"
            target="_blank"
          >
            Read this post on {post.userName}'s Website
          </a>
          {postImage}
        </div>
      ) : (
        <div>{postImage}</div>
      )}
      {!post.provideURL && (
        <div className="content-container">
          <MyEditor readOnly={true} editorState={body} onChange={() => {}} />
        </div>
      )}
    </Layout>
  );
};

ShowPostPage.getInitialProps = async function({ query }) {
  const { id } = query;
  const post = await getPost(id);
  return { post };
};

export default ShowPostPage;
