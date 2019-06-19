import React, { Fragment } from "react";
import Editor from "react-avatar-editor";
import { connect } from "react-redux";
import uuid from "uuid";
import Avatar from "react-avatar";
import { IoMdCamera } from "react-icons/io";
import Modal from "react-modal";

import { uploadFile } from "./../aws/s3";
import { updateUserProfilePicture } from "./../queries/user";
import { updateProfilePicture } from "./../actions/auth";
import Loading from "./Loading";

class AvatarEditor extends React.Component {
  constructor(props) {
    super(props);
    const { userPhotoURL: currentImageUrl, uid } = props.user;
    this.state = {
      currentImageUrl,
      uploadedImage: null,
      uid,
      uploading: false,
      modalIsOpen: false
    };
  }

  closeModal = () => {
    this.setState(() => ({ modalIsOpen: false }));
  };

  onImageSave = () => {
    const { uid } = this.state;
    const { updateProfilePicture } = this.props;
    const canvas = this.editor.getImage();
    this.setState(() => ({ uploading: true, modalIsOpen: false }));

    canvas.toBlob(blob => {
      const file = new File([blob], "profile_picture", {
        type: blob.type
      });
      uploadFile({ file, location: `users/${uid}` })
        .then(data => {
          const { Location: newUserPhotoURL } = data;
          this.setState(() => ({
            uploading: false,
            currentImageUrl: `${newUserPhotoURL}?${new Date().getTime()}`
          }));

          updateUserProfilePicture({ uid, newUserPhotoURL });
          updateProfilePicture(`${newUserPhotoURL}?${new Date().getTime()}`);
        })
        .catch(e => {
          this.setState(() => ({ uploading: false }));
          alert(e);
        });
    });
  };

  onImageChange = e => {
    const uploadedImage = e.target.files[0];
    if (!uploadedImage) {
      return;
    }
    this.setState(() => ({ uploadedImage, modalIsOpen: true }));
  };

  onCancel = () => {
    this.setState(() => ({
      modalIsOpen: false
    }));
  };

  triggerFileDialog = () => {
    document.getElementById("imageInput").click();
  };

  setEditorRef = editor => (this.editor = editor);

  render() {
    const {
      uploadedImage,
      currentImageUrl,
      uploading,
      modalIsOpen
    } = this.state;
    return (
      <div
        className="relative flex align-items--center justify-content--center"
        style={{ height: 100, width: 100 }}
      >
        <Fragment>
          <Avatar
            className="absolute pointer"
            src={currentImageUrl}
            round={true}
            size={100}
            onClick={this.triggerFileDialog}
          />
          {uploading ? (
            <div className="absolute">
              <Loading size={40} />
            </div>
          ) : (
            <Fragment>
              <input
                id="imageInput"
                className="hide"
                type="file"
                onChange={this.onImageChange}
              />

              <IoMdCamera
                className="absolute pointer h2 text-white"
                onClick={this.triggerFileDialog}
              />
            </Fragment>
          )}
        </Fragment>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={this.closeModal}
          className="modal"
          contentLabel="Example Modal"
        >
          <p className="modal__title h3 favourite-font-weight">Edit Media</p>
          <Editor ref={this.setEditorRef} image={uploadedImage} />
          <div className="flex justify-content--between">
            <button className="button" onClick={this.onImageSave}>Save</button>
            <button className="button button--warm-peach" onClick={this.onCancel}>Cancel</button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateProfilePicture: userPhotoURL =>
    dispatch(updateProfilePicture(userPhotoURL))
});

export default connect(
  null,
  mapDispatchToProps
)(AvatarEditor);
