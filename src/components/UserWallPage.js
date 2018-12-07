import React from "react";
import { connect } from "react-redux";
import PageHeader from "./PageHeader";
import { startGetUser } from "./../actions/users";
import LoadingPage from "./LoadingPage";
import FilterablePostList from './FilterablePostList';

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
  
  render() {
    return (
      <div>
        {!this.state.title ? (
          <LoadingPage />
        ) : (
          <div>
            <PageHeader title={this.state.title} />
            <div className="content-container">
              <FilterablePostList 
                SearchBarAutoFocus={true} 
                posts={this.props.posts} 
                noPostText={`${this.state.user.userName} has not published any post yet.`}
                />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ posts }, props) => ({
  posts: posts.filter(post => post.uid === props.match.params.uid)
});

const mapDispatchToProps = (dispatch, props) => ({
  startGetUser: () => dispatch(startGetUser(props.match.params.uid))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserWallPage);
