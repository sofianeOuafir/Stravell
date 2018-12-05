import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PostList from "./PostList";
import PageHeader from "./PageHeader";
import { auth } from "./../firebase/firebase";
import { startGetUser } from "./../actions/users";
import LoadingPage from "./LoadingPage";
import SearchBar from "./SearchBar";
import { getVisiblePosts } from "./../selectors/posts";

class UserWallPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      title: ""
    };
  }

  componentDidMount() {
    this.props.startGetUser().then(snapshot => {
      const user = { uid: snapshot.key, ...snapshot.val() };
      this.setState(() => ({ user, title: user.userName }));
    });
  }

  getNoPostText() {
    return this.props.posts.length === 0 && this.props.filters.text.length === 0
    ? `${this.state.user.userName} has not published any post yet.`
    : `No results were found for ${this.props.filters.text}.`
  }

  render() {
    return (
      <div>
        {!this.state.title ? (
          <LoadingPage />
        ) : (
          <div>
            <PageHeader title={this.state.title} />
            <div className="content-container">
              <SearchBar autoFocus={true} />
              <PostList
                className="post-list post-list--no-border-top"
                posts={this.props.posts}
                noPostText={this.getNoPostText()}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ posts, filters }, props) => ({
  posts: getVisiblePosts(
    posts.filter(post => post.uid === props.match.params.uid),
    filters
  ),
  filters
});

const mapDispatchToProps = (dispatch, props) => ({
  startGetUser: () => dispatch(startGetUser(props.match.params.uid))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserWallPage);
