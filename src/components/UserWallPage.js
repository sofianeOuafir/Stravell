import React from "react";
import { connect } from 'react-redux';

import PageHeader from "./PageHeader";
import FilterablePostList from "./FilterablePostList";
import Layout from "./Layout";
import { APP_NAME } from "./../constants/constants";
import { setCountries } from "./../actions/countries";
import { getPosts } from "../queries/post";
import { getCountries } from "../queries/country";
import { getUser } from "../queries/user";
export class UserWallPage extends React.Component {
  async componentDidMount() {
    const { uid } = this.props.user;
    const countries = await getCountries({ uid });
    this.props.dispatch(setCountries(countries));
  }

  render() {
    const { posts } = this.props;
    const { userName } = this.props.user;
    return (
      <Layout title={`${APP_NAME} | ${userName}`} description={`This page describe ${userName}'s profile`}>
        <div>
          <PageHeader title={userName} />
          <div className="content-container">
            <FilterablePostList
              SearchBarAutoFocus={true}
              posts={posts}
              noPostText={`${userName} has not published any post yet.`}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

UserWallPage.getInitialProps = async function({ query }) {
  const { uid } = query; 
  const posts = await getPosts({ uid });
  const user = await getUser(uid);
  return { posts, user };
};

export default connect()(UserWallPage);
