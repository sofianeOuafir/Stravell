import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { editorStateFromRaw, editorStateToJSON } from "megadraft";
import MyEditor from './MyEditor';


class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: (props.post && props.post.title) || "",
      body: (props.post && editorStateFromRaw(JSON.parse(props.post.body))) || editorStateFromRaw(null),
      createdAt: (props.post && moment(props.post.createdAt)) || moment(),
      updatedAt: moment(),
      error: ""
    };
  }

  onTitleChange = e => {
    const title = e.target.value;
    this.setState(() => ({ title }));
  };

  onBodyChange = editorState => {
    this.setState(() => ({ body: editorState }));
  };

  onSubmit = e => {
    e.preventDefault();
    if (
      this.state.title != "" &&
      this.state.body.getCurrentContent().hasText()
    ) {
      this.props.onSubmit({
        title: this.state.title,
        body: editorStateToJSON(this.state.body),
        createdAt: this.state.createdAt.valueOf(),
        updatedAt: this.state.updatedAt.valueOf()
      });
    } else {
      this.setState(params => ({ error: "Please provide a title and a body" }));
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

export default connect()(PostForm);
