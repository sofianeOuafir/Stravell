import React, { Fragment } from "react";
import pluralize from "pluralize";
import Modal from "react-modal";
import { connect } from "react-redux";

import { MdComment } from "react-icons/md";
import PostCommentForm from "./PostCommentForm";
import PostCommentList from "./PostCommentList";

class CommentsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
  }

  openModal = () => {
    this.setState(() => ({ modalIsOpen: true }));
  };

  closeModal = () => {
    this.setState(() => ({ modalIsOpen: false }));
  };

  render() {
    const { post, comments = [] } = this.props;

    return (
      <Fragment>
        <div className="flex align-items--center mt1">
          <MdComment className="mr1" />

          <a className="pointer underline" onClick={this.openModal}>
            {pluralize("comment", comments.length, true)}
          </a>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="large-modal scrollable-modal"
          contentLabel="Comments"
        >
          <PostCommentList post={post} comments={comments} />
          <PostCommentForm postId={post.id} />
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ posts }, { post }) => {
  const obj = posts.find(element => element.id === post.id);
  return {
    comments: obj.comments
  };
};

export default connect(mapStateToProps)(CommentsModal);
