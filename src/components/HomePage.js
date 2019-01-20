import React from "react";
import { connect } from "react-redux";
import FilterablePostList from "../components/FilterablePostList";
import PageHeader from "./PageHeader";
import { NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT } from "./../constants/constants";
import { setPosts } from "./../actions/posts";
import database from "./../firebase/firebase";
import page from './../hocs/page';

export const HomePage = page(({ userName, posts }) => (
  <div>
    <PageHeader title={`Welcome${userName ? `, ${userName}` : ""}`} />
    <div className="content-container">
      <FilterablePostList
        SearchBarAutoFocus={true}
        posts={posts}
        noPostText={NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT}
      />
    </div>
  </div>
), { title: 'mytitle', description: 'mydescription' });

HomePage.getInitialProps = async function() {
  const posts = await new Promise((resolve, reject) => {
    database
    .ref("posts")
    .orderByChild("createdAt")
    .on("value", snapshot => {
      let posts = [];
      snapshot.forEach(snapshotChild => {
        posts.push({
          id: snapshotChild.key,
          ...snapshotChild.val()
        });
      });
      posts = posts.reverse();
      resolve(posts);
    });
  });
  return { posts };
};

// const mapStateToProps = ({ posts, auth }) => ({
//   posts,
//   userName: auth.userName
// });

export default connect()(HomePage);
