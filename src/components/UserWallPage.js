import React from "react";
import { connect } from "react-redux";
import PostList from "./PostList";
import PageHeader from "./PageHeader";
import { auth } from "./../firebase/firebase";
import { startGetUser } from "./../actions/users";
import LoadingPage from "./LoadingPage";

class UserWallPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
  }

  componentDidMount() {
    this.props.startGetUser().then(snapshot => {
      const { userName } = snapshot.val();
      this.setState(() => ({ title: userName }));
    });
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
              <PostList posts={this.props.posts} editable={false} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  posts: state.posts.filter(post => post.uid === props.match.params.uid)
});

const mapDispatchToProps = (dispatch, props) => ({
  startGetUser: () => dispatch(startGetUser(props.match.params.uid))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserWallPage);
