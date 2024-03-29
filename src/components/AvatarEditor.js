import React, { Fragment } from "react";
import Editor from "react-avatar-editor";
import { connect } from "react-redux";
import Avatar from "react-avatar";
import { IoMdCamera } from "react-icons/io";
import Modal from "react-modal";

import { uploadFile } from "./../aws/s3";
import { startUpdateUserProfilePicture } from "./../actions/users";
import Loader from "./Loader";

class AvatarEditor extends React.Component {
  constructor(props) {
    super(props);
    const { userPhotoURL: currentImageUrl, uid, userName } = props.user;
    this.state = {
      currentImageUrl,
      uploadedImage: null,
      uid,
      uploading: false,
      modalIsOpen: false,
      userName
    };
  }

  closeModal = () => {
    this.setState(() => ({ modalIsOpen: false }));
  };

  onImageSave = () => {
    const { uid } = this.state;
    const { startUpdateUserProfilePicture } = this.props;
    const canvas = this.editor.getImage();
    this.setState(() => ({ uploading: true, modalIsOpen: false }));

    canvas.toBlob(blob => {
      const file = new File([blob], "profile_picture", {
        type: blob.type
      });
      uploadFile({ file, location: `users/${uid}` })
        .then(data => {
          const { Location: userPhotoURL } = data;

          startUpdateUserProfilePicture({ uid, userPhotoURL })
            .then(() => {
              this.setState(() => ({
                uploading: false,
                currentImageUrl: `${userPhotoURL}?${new Date().getTime()}`
              }));
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          this.setState(() => ({ uploading: false }));
          console.log(e);
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
      modalIsOpen,
      userName
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
            name={userName}
            textSizeRatio={-40}
          />
          {uploading ? (
            <div className="absolute">
              <Loader color="white" size={40} />
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
          contentLabel="Edit Media"
        >
          <p className="modal__title h3 favourite-font-weight">Edit Media</p>
          <Editor ref={this.setEditorRef} image={uploadedImage} />
          <div className="flex justify-content--between mb1">
            <button className="button" onClick={this.onImageSave}>
              Save
            </button>
            <button
              className="button button--warm-peach"
              onClick={this.onCancel}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startUpdateUserProfilePicture: ({ uid, userPhotoURL }) =>
    dispatch(startUpdateUserProfilePicture({ uid, userPhotoURL }))
});

export default connect(
  null,
  mapDispatchToProps
)(AvatarEditor);
