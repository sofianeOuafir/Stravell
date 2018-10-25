import React from 'react';
import {Editor, RichUtils} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.props.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  onBoldClick = (e) => {
    e.preventDefault();
    this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD'));
  }

  render() {
    return (
      <div>
        <button onClick={this.onBoldClick}>Make it Bold</button>
        <Editor editorState={this.props.editorState} onChange={this.props.onChange} handleKeyCommand={this.handleKeyCommand} />
      </div>
    );
  }
}

export default MyEditor;