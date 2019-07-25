import React from "react";
import { connect } from "react-redux";

import { addPostComment } from "./../actions/comments";

class PostCommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: (props.comment && props.comment.text) || ""
    };
  }

  onTextChange = e => {
    const text = e.target.value;
    this.setState(() => ({ text }));
  };

  onSubmit = () => {
    const { postId, addPostComment, uid, userName, userPhotoURL } = this.props;
    const comment = {
      userPhotoURL,
      uid,
      userName,
      text: this.state.text
    }
    addPostComment({ postId, comment });
    this.setState(() => ({ text: '' }));
  };

  render() {
    return (
      <div>
        <input
          type="text"
          onChange={this.onTextChange}
          value={this.state.text}
        />
        <button onClick={this.onSubmit}>Submit</button>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  uid: auth.uid,
  userName: auth.userName,
  userPhotoURL: auth.userPhotoURL
});

const mapDispatchToProps = dispatch => ({
  addPostComment: ({ postId, comment }) => {
    dispatch(addPostComment({ postId, comment }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostCommentForm);
