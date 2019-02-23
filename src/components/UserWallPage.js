import React from "react";
import { connect } from "react-redux";

import PageHeader from "./PageHeader";
import FilterablePostList from "./FilterablePostList";
import Layout from "./Layout";
import { APP_NAME } from "./../constants/constants";
import { setCountries } from "./../actions/countries";
import { getUserPosts } from "../queries/post";
import { getCountries } from "../queries/country";
import { getUser } from "../queries/user";
import { getUserPlaces } from "./../queries/place";
export class UserWallPage extends React.Component {
  async componentDidMount() {
    const { id } = this.props.user;
    const countries = await getCountries({ uid: id });
    this.props.dispatch(setCountries(countries));
  }

  render() {
    const { posts, places } = this.props;
    const { userName, id } = this.props.user;
    const googleMapsProps = {
      isMarkerShown: true,
      places,
      showWholeWorld: true
    };
    const breadcrumbLinks = [
      { href: "/", text: "Home" },
      {
        href: `/user?uid=${id}`,
        as: `/u/show/${userName}/${id}`,
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
          <PageHeader title={userName} />
          <div className="content-container">
            <FilterablePostList
              SearchBarAutoFocus={true}
              posts={posts}
              noPostText={`${userName} has not published any post yet.`}
              googleMapsProps={googleMapsProps}
              breadCrumbProps={{
                links: breadcrumbLinks
              }}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

UserWallPage.getInitialProps = async function({ query }) {
  const { uid } = query;
  const posts = await getUserPosts(uid);
  const user = await getUser(uid);
  const places = await getUserPlaces(uid);
  return { posts, user, places };
};

export default connect()(UserWallPage);
