import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { startAddPostComment } from "./../actions/comments";

class PostCommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: (props.comment && props.comment.text) || "",
      saving: false
    };
  }

  onTextChange = e => {
    const text = e.target.value;
    this.setState(() => ({ text }));
  };

  onSubmit = e => {
    e.preventDefault();
    const {
      postId,
      startAddPostComment,
      uid,
      userName,
      userPhotoURL = null
    } = this.props;
    const comment = {
      userPhotoURL,
      uid,
      userName,
      text: this.state.text,
      createdAt: moment().valueOf(),
      postId
    };
    this.setState(
      () => ({ saving: true }),
      () => {
        startAddPostComment(comment)
          .then(() => {
            this.setState(() => ({ text: "", saving: false }));
          })
          .catch(e => {
            this.setState(() => ({
              saving: false
            }));
            console.log(e);
          });
      }
    );
  };

  render() {
    const { uid } = this.props;
    const authenticatedUser = !!uid;
    return (
      <Fragment>
        <form id="form" className="form" name="postCommentForm" onSubmit={this.onSubmit}>
          <div className="form__input-container">
            <textarea
              placeholder={
                authenticatedUser
                  ? "Write a comment here"
                  : "Please log in to Stravell for writing a comment"
              }
              className="textarea"
              type="text"
              onChange={this.onTextChange}
              value={this.state.text}
              disabled={!authenticatedUser}
            />
          </div>
          <button
            disabled={
              !(
                authenticatedUser &&
                !!this.state.text.trim() &&
                !this.state.saving
              )
            }
            className="button"
          >
            {this.state.saving ? "Saving..." : "Submit"}
          </button>
        </form>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  uid: auth.uid,
  userName: auth.userName,
  userPhotoURL: auth.userPhotoURL
});

const mapDispatchToProps = dispatch => ({
  startAddPostComment: comment => dispatch(startAddPostComment(comment))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostCommentForm);
