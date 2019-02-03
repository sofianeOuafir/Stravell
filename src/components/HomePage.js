import React from "react";
import { connect } from "react-redux";

import FilterablePostList from "../components/FilterablePostList";
import PageHeader from "./PageHeader";
import {
  NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT,
  HOME_PAGE_TITLE,
  HOME_PAGE_DESCRIPTION
} from "./../constants/constants";
import { setCountries } from "./../actions/countries";
import database from "./../firebase/firebase";
import Layout from "./Layout";
import { setTextFilter, setCountryFilter } from "../actions/filters";

export class HomePage extends React.Component {
  async componentDidMount() {
    const countrySnapshot = await database
      .ref("countries")
      .once("value")
      .then(snapshot => {
        return snapshot;
      });

    let countries = [];
    countrySnapshot.forEach(snapshotChild => {
      countries.push({
        id: snapshotChild.key,
        ...snapshotChild.val()
      });
    });
    this.props.dispatch(setCountries(countries));
    this.props.dispatch(setTextFilter(''));
    this.props.dispatch(setCountryFilter(''));
  }

  render() {
    const { userName, posts, countries } = this.props;
    return (
      <Layout title={HOME_PAGE_TITLE} description={HOME_PAGE_DESCRIPTION}>
        <PageHeader title={`Welcome${userName ? `, ${userName}` : ""}`} />
        <div className="content-container">
          <FilterablePostList
            SearchBarAutoFocus={true}
            posts={posts}
            noPostText={NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT}
          />
        </div>
      </Layout>
    );
  }
}

HomePage.getInitialProps = async function({ req, reduxStore }) {
  const postSnapshot = await database
    .ref("posts")
    .orderByChild("createdAt")
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  let posts = [];
  postSnapshot.forEach(snapshotChild => {
    posts.push({
      id: snapshotChild.key,
      ...snapshotChild.val()
    });
  });
  posts = posts.reverse();

  return { posts };
};

const mapStateToProps = ({ auth }) => ({
  userName: auth.userName
});

export default connect(mapStateToProps)(HomePage);
