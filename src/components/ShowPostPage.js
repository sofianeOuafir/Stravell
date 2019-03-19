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
import Loading from "./Loading";

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

export class ShowPostPage extends React.Component {
  constructor(props) {
    super(props);
    const { post } = this.props;
    this.state = {};
    if (post.provideURL) {
      this.state["loading"] = true;
    }
  }

  componentDidMount = () => {
    const { post } = this.props;
    if (post.provideURL) {
      setTimeout(() => {
        this.setState(() => ({ loading: false }));
      }, 3000);
    }
  };

  render() {
    const { post } = this.props;
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
    const postImage = (
      <img src={`${post.image}`} alt="" className="fullwidth" />
    );
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
              placeId={post.placeId}
              iconClassName="ml1 mr1 text-dark-grey"
              addressClassName="text-dark-grey"
            />
          )}
        </PageHeader>
        <div className="content-container">
          <div className="mb1">
            <BreadCrumb links={breadcrumbLinks} />
          </div>
        </div>
        {post.provideURL ? (
          <Fragment>
            {this.state.loading && (
              <div className="loading-container">
                <Loading size="medium" />
              </div>
            )}
            <iframe
              src={`${post.providedURL}`}
              className={`fullwidth ${this.state.loading ? "hide" : ""}`}
              style={{ height: "1300px" }}
            />
          </Fragment>
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
      </Layout>
    );
  }
}

ShowPostPage.getInitialProps = async function({ query }) {
  const { id } = query;
  const post = await getPost(id);
  return { post };
};

export default ShowPostPage;
