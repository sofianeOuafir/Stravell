import React from "react";
import Editor from "draft-js-plugins-editor";
import createUndoPlugin from "draft-js-undo-plugin";
import createEmojiPlugin from 'draft-js-emoji-plugin';

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const undoPlugin = createUndoPlugin();
const { UndoButton, RedoButton } = undoPlugin;

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Editor plugins={[undoPlugin, emojiPlugin]} {...this.props} />
        {!this.props.readOnly && (
          <div>
            <UndoButton />
            <RedoButton />
            <EmojiSuggestions />
            <EmojiSelect />
          </div>
        )}
      </div>
    );
  }
}

export default MyEditor;
