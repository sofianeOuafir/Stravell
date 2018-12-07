import React from "react";
import moment from "moment";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { titleize, capitalize } from 'underscore.string';

import MyEditor from "./MyEditor";
import { uploadFile } from "./../aws/s3";

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
      error: ""
    };
  }

  onDescriptionChange = e => {
    const description = e.target.value;
    this.setState(() => ({ description: capitalize(description) }));
  };

  onTitleChange = e => {
    const title = e.target.value;
    this.setState(() => ({ title: titleize(title) }));
  };

  onImageChange = e => {
    const file = e.target.files[0];
    uploadFile(file).then(({Location}) => {
      this.setState(() => ({ image: Location }))
    }).catch((err) => {
      alert(err);
    })
  }

  onBodyChange = editorState => {
    this.setState(() => ({ body: editorState }));
  };

  onSubmit = e => {
    e.preventDefault();
    if (
      this.state.title != "" &&
      this.state.description != "" &&
      this.state.image != "" &&
      this.state.body.getCurrentContent().hasText()
    ) {
      this.props.onSubmit({
        title: this.state.title,
        description: this.state.description,
        image: this.state.image,
        body: JSON.stringify(convertToRaw(this.state.body.getCurrentContent())),
        createdAt: this.state.createdAt.valueOf(),
        updatedAt: this.state.updatedAt.valueOf()
      });
    } else {
      this.setState(() => ({
        error: "Please provide a title, a body, a description and an Image"
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
        <input
          placeholder="Write a small description here"
          className="text-input"
          type="text"
          onChange={this.onDescriptionChange}
          value={this.state.description}
        />
        <input 
          type="file" 
          accept="image/*"
          onChange={this.onImageChange}
        />
        {
          this.state.image && 
          <img src={`${this.state.image}`} alt={`${this.state.image}`} />
        }
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
