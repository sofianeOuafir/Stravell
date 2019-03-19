import React, { Fragment } from "react";
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
      as: `/region/${slugify(post.country)}/${post.regionCode}`,
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
      <div className="margin-top-to-navbar">
        <div className="content-container">
          <div className="mb1">
            <BreadCrumb links={breadcrumbLinks} />
          </div>
        </div>
        {post.provideURL ? (
          <embed
            src={`${post.providedURL}`}
            className="fullwidth"
            style={{ height: "1300px" }}
          />
        ) : (
          <Fragment>
            <div>{postImage}</div>
            <div className="content-container">
              <MyEditor
                readOnly={true}
                editorState={body}
                onChange={() => {}}
              />
            </div>
          </Fragment>
        )}
      </div>
    </Layout>
  );
};

ShowPostPage.getInitialProps = async function({ query }) {
  const { id } = query;
  const post = await getPost(id);
  return { post };
};

export default ShowPostPage;
