import React from "react";
import moment from "moment";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import MyEditor from "./MyEditor";
import { uploadFile } from "./../aws/s3";
import {
  formatTitle,
  formatDescription,
  getTitleError,
  getDescriptionError,
  getImageError
} from "./../lib/utils/post";

class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: (props.post && props.post.title) || "",
      description: (props.post && props.post.description) || "",
      image: (props.post && props.post.image) || "",
      body:
        (props.post &&
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(props.post.body))
          )) ||
        EditorState.createEmpty(),
      createdAt: (props.post && moment(props.post.createdAt)) || moment(),
      updatedAt: moment(),
      titleError: "",
      descriptionError: "",
      imageError: "",
      bodyError: ""
    };
  }

  onDescriptionChange = e => {
    const description = e.target.value;
    this.setState(() => ({
      description: description,
      descriptionError: getDescriptionError(description)
    }));
  };

  onTitleChange = e => {
    const title = e.target.value;
    this.setState(() => ({ title: title, titleError: getTitleError(title) }));
  };

  onImageChange = e => {
    const file = e.target.files[0];
    uploadFile(file)
      .then(({ Location }) => {
        this.setState(() => ({ image: Location, imageError: getImageError(Location) }));
      })
      .catch(err => {
        alert(err);
      });
  };

  onBodyChange = editorState => {
    this.setState(() => ({ body: editorState }));
  };

  onSubmit = e => {
    e.preventDefault();
    let errors = {
      title: getTitleError(this.state.title),
      description: getDescriptionError(this.state.description),
      image: getImageError(this.state.image),
      body: ""
    };
    if (
      errors.title === "" &&
      errors.description === "" &&
      errors.image === "" &&
      errors.body === ""
    ) {
      this.props.onSubmit({
        title: formatTitle(this.state.title),
        description: formatDescription(this.state.description),
        image: this.state.image,
        body: JSON.stringify(convertToRaw(this.state.body.getCurrentContent())),
        createdAt: this.state.createdAt.valueOf(),
        updatedAt: this.state.updatedAt.valueOf()
      });
    } else {
      this.setState(() => ({
        titleError: errors.title,
        descriptionError: errors.description,
        imageError: errors.image,
        bodyErrors: errors.body
      }));
    }
  };

  render() {
    return (
      <form className="form" onSubmit={this.onSubmit}>
        {!!this.state.error && <p>{this.state.error}</p>}
        <input
          placeholder="Write a title here"
          className="text-input"
          type="text"
          onChange={this.onTitleChange}
          autoFocus
          value={this.state.title}
        />
        {this.state.titleError && <p>{this.state.titleError}</p>}
        <input
          placeholder="Write a small description here"
          className="text-input"
          type="text"
          onChange={this.onDescriptionChange}
          value={this.state.description}
        />
        {this.state.descriptionError && <p>{this.state.descriptionError}</p>}
        <input type="file" accept="image/*" onChange={this.onImageChange} />
        {this.state.imageError && <p>{this.state.imageError}</p>}
        {this.state.image && (
          <img src={`${this.state.image}`} alt={`${this.state.image}`} />
        )}
        <MyEditor
          placeholder="Write your article here"
          editorState={this.state.body}
          onChange={this.onBodyChange}
        />
        <div>
          <button className="button">Save Post</button>
        </div>
      </form>
    );
  }
}

export default PostForm;
