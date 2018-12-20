import React from "react";
import moment from "moment";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { FaCheck, FaTimes } from "react-icons/fa";
import MyEditor from "./MyEditor";
import { uploadFile } from "./../aws/s3";
import Loading from "./Loading";
import {
  formatTitle,
  formatDescription,
  getTitleError,
  getDescriptionError,
  getImageError,
  getBodyError
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
      bodyError: "",
      imageUploading: false
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
    if(!file) {
      return;
    }
    this.setState(() => ({ imageUploading: true }), () => {
      uploadFile(file)
        .then(({ Location }) => {
          this.setState(() => ({ image: Location, imageError: getImageError(Location), imageUploading: false }));
        })
        .catch(err => {
          alert(err);
          this.setState(() => ({ imageUploading: false }))
        });
    });
  };

  onBodyChange = editorState => {
    const body = editorState.getCurrentContent().getPlainText();
    this.setState(() => ({ body: editorState, bodyError: getBodyError(body) }));
  };

  onSubmit = e => {
    e.preventDefault();
    let errors = {
      title: getTitleError(this.state.title),
      description: getDescriptionError(this.state.description),
      image: getImageError(this.state.image),
      body: getBodyError(this.state.body.getCurrentContent().getPlainText())
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
        bodyError: errors.body
      }));
    }
  }

  getValidationIcon = (error) => {
    if(error) {
      return <FaTimes className={`icon c-warm-peach`}/>;
    } else {
      return <FaCheck className={`icon c-limegreen`} />;
    }
  }

  render() {
    return (
      <form className="form" onSubmit={this.onSubmit}>
        <div className="form__input-container">
          { this.getValidationIcon(this.state.titleError) }
          <input
            placeholder="Write a title here"
            className="text-input"
            type="text"
            onChange={this.onTitleChange}
            autoFocus
            value={this.state.title}
          />
          {this.state.titleError && <p className="error">{this.state.titleError}</p>}
        </div>
        <div className="form__input-container">
          { this.getValidationIcon(this.state.descriptionError) }
          <input
            placeholder="Write a small description here"
            className="text-input"
            type="text"
            onChange={this.onDescriptionChange}
            value={this.state.description}
          />
          {this.state.descriptionError && <p className="error">{this.state.descriptionError}</p>}
        </div>
        <div className="form__input-container">
          { this.getValidationIcon(this.state.imageError) }  
          <input type="file" accept="image/*" onChange={this.onImageChange} className="text-input" />
          {this.state.imageError && <p className="error">{this.state.imageError}</p>}
          <div className="quarterwidth flex align-items--center justify-content--center mt2">
            { this.state.imageUploading ? 
              (
                <Loading size="small" />
              )
              :
              (
                this.state.image && (
                  <img src={`${this.state.image}`} alt={`${this.state.image}`} className="fullwidth" />
                )
              )
            }
          </div>

        </div>
        <div className="form__input-container">
          { this.state.bodyError && <p className="error">{this.state.bodyError}</p>}
          <MyEditor
            placeholder="Write your article here"
            editorState={this.state.body}
            onChange={this.onBodyChange}
          />
        </div>
        <div>
          <button className="button">Save Post</button>
        </div>
      </form>
    )
  }
}

export default PostForm;
