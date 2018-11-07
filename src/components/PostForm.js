import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import MyEditor from './MyEditor';

// const initialState = {
//   "entityMap": {
//       "0": {
//           "type": "IMAGE",
//           "mutability": "IMMUTABLE",
//           "data": {
//               "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Elephants_at_Etosha_National_Park03.JPG/240px-Elephants_at_Etosha_National_Park03.JPG"
//           }
//       }
//   },
//   "blocks": [{
//       "key": "9gm3s",
//       "text": "You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.",
//       "type": "unstyled",
//       "depth": 0,
//       "inlineStyleRanges": [],
//       "entityRanges": [],
//       "data": {}
//   }, {
//       "key": "ov7r",
//       "text": " ",
//       "type": "atomic",
//       "depth": 0,
//       "inlineStyleRanges": [],
//       "entityRanges": [{
//           "offset": 0,
//           "length": 1,
//           "key": 0
//       }],
//       "data": {}
//   }, {
//       "key": "e23a8",
//       "text": "See advanced examples further down …",
//       "type": "unstyled",
//       "depth": 0,
//       "inlineStyleRanges": [],
//       "entityRanges": [],
//       "data": {}
//   }]
// };

class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: (props.post && props.post.title) || "",
      body: (props.post && EditorState.createWithContent(convertFromRaw(JSON.parse(props.post.body)))) || EditorState.createEmpty(),
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
        body: JSON.stringify(convertToRaw(this.state.body.getCurrentContent())),
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
