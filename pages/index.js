import React from "react";
import { connect } from "react-redux";
import PostList from "../src/components/PostList";
import PageHeader from "../src/components/PageHeader";
import { NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT } from "../src/constants/constants";
import { startSetPosts } from "../src/actions/posts";
import database from "../src/firebase/firebase";

export const HomePage = ({ userName, posts }) => (
  <div>
    <PageHeader title={`Welcome${userName ? `, ${userName}` : ""}`} />
    <div className="content-container">
      <PostList
        posts={posts}
        noPostText={NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT}
      />
    </div>
  </div>
);

HomePage.getInitialProps = () => {
  let posts = [];
  database
    .ref("posts")
    .orderByChild("createdAt")
    .on("value", snapshot => {
      snapshot.forEach(snapshotChild => {
        posts.push({
          id: snapshotChild.key,
          ...snapshotChild.val()
        });
      });
      posts = posts.reverse();
    });
    return { posts };
};
export default HomePage;

// const mapStateToProps = ({ posts, auth }) => ({
//   posts,
//   userName: auth.userName
// });

// export default connect(mapStateToProps)(HomePage);
