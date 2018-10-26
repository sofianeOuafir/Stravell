import React from "react";
import moment from "moment";
import uuid from "uuid";
import { connect } from 'react-redux';
import MyEditor from './MyEditor';
import {EditorState} from 'draft-js';
class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: (props.post && props.post.id) || uuid(),
      title: (props.post && props.post.title) || "",
      body: (props.post && props.post.body) || EditorState.createEmpty(),
      createdAt: (props.post && moment(props.post.createdAt)) || moment(),
      updatedAt: moment(),
      uid: (props.post && props.post.uid) || props.uid,
      userName: (props.post && props.post.userName) || props.userName,
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
    if (this.state.title != "" && this.state.body.getCurrentContent().hasText()) {
      this.props.onSubmit({
        id: this.state.id,
        title: this.state.title,
        body: this.state.body,
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        uid: this.state.uid,
        userName: this.state.userName
      });
    } else {
      this.setState(params => ({ error: "Please provide a title and a body" }));
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {!!this.state.error && <p>{this.state.error}</p>}
        <input
          type="text"
          onChange={this.onTitleChange}
          autoFocus
          value={this.state.title}
        />
        <MyEditor editorState={this.state.body} onChange={this.onBodyChange} />
        <button>Save Post</button>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  userName: state.auth.userName
});

export default connect(mapStateToProps)(PostForm);
