import React from "react";
import { slugify } from "underscore.string";
import { connect } from "react-redux";

import PageHeader from "./PageHeader";
import FilterableDataList from "./FilterableDataList";
import Layout from "./Layout";
import { APP_NAME } from "./../constants/constants";
import { getUserPosts } from "../queries/post";
import { getUser } from "../queries/user";
import { getUserPlaces } from "./../queries/place";
import PostList from "./PostList";
import PostAuthor from "./PostAuthor";
import { setPosts } from "./../actions/posts";
import { setPlaces } from "./../actions/places";

export class UserWallPage extends React.Component {
  static getInitialProps = async function({ query, reduxStore }) {
    const { uid } = query;
    const posts = await getUserPosts({ uid });
    const user = await getUser(uid);
    const places = await getUserPlaces(uid);
    reduxStore.dispatch(setPosts(posts));
    reduxStore.dispatch(setPlaces(places));
    return { user };
  };

  render() {
    const { posts, places, user } = this.props;
    const { userName, id, userPhotoURL } = user;
    const googleMapsProps = {
      isMarkerShown: true,
      places,
      showWholeWorld: true
    };
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/user?uid=${id}`,
        as: `/u/show/${slugify(userName)}/${id}`,
        text: userName,
        active: true
      }
    ];
    return (
      <Layout
        title={`${APP_NAME} | ${userName}`}
        description={`This page describe ${userName}'s profile`}
      >
        <div>
          <PageHeader>
            <PostAuthor
              authorUid={id}
              avatarSize={100}
              authorPhotoURL={userPhotoURL}
              authorName={userName}
              fontSize={30}
            />
          </PageHeader>

          <div className="content-container">
            <FilterableDataList
              DataList={PostList}
              data={posts}
              noDataText={`${userName} has not published any post yet.`}
              googleMapsProps={googleMapsProps}
              breadCrumbProps={{
                links: breadcrumbLinks
              }}
              mapCallToAction={`This is ${userName}'s map! The markers represent where ${userName} have been writing about. Click on a marker to start reading about a place!`}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = ({ posts, places }) => ({
  posts,
  places
});

export default connect(mapStateToProps)(UserWallPage);
