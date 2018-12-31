import React from "react";
import Editor, { composeDecorators } from "draft-js-plugins-editor";
import createUndoPlugin from "draft-js-undo-plugin";
import createImagePlugin from "draft-js-image-plugin";
import createAlignmentPlugin from "draft-js-alignment-plugin";
import createFocusPlugin from "draft-js-focus-plugin";
import createResizeablePlugin from "draft-js-resizeable-plugin";
import createBlockDndPlugin from "draft-js-drag-n-drop-plugin";
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createLinkPlugin from 'draft-js-anchor-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  OrderedListButton,
  UnorderedListButton,
  BlockquoteButton
} from "draft-js-buttons";

import { uploadFile } from './../aws/s3';
import createDragNDropUploadPlugin from './../lib/draft-js-drag-n-drop-upload-plugin/';

const inlineToolbarPlugin = createInlineToolbarPlugin();
const linkPlugin = createLinkPlugin();
const undoPlugin = createUndoPlugin();
const alignmentPlugin = createAlignmentPlugin();
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const linkifyPlugin = createLinkifyPlugin({ target: '_blank' });

const { InlineToolbar } = inlineToolbarPlugin;
const { AlignmentTool } = alignmentPlugin;
const { LinkButton } = linkPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

const imagePlugin = createImagePlugin({ decorator });

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: (files, success, failure, editorProps) => {
    files.forEach(file => {
      uploadFile({ file, location: `pictures/${editorProps.s3FolderName}` }).then((data) => {
        success(data);
      }).catch((err) => {
        failure(err);
      })
    });
  },
  addImage: imagePlugin.addImage
});

const plugins = [
  inlineToolbarPlugin,
  linkPlugin,
  linkifyPlugin,
  dragNDropFileUploadPlugin,
  undoPlugin,
  imagePlugin,
  alignmentPlugin,
  focusPlugin,
  resizeablePlugin,
  blockDndPlugin
];

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div onClick={this.focus} className={ !this.props.readOnly && "editor-container" } >
        <Editor
          plugins={plugins}
          {...this.props}
          ref={element => {
            this.editor = element;
          }}
        />
        {!this.props.readOnly && (
          <div>
            <AlignmentTool />
            <InlineToolbar>
            {
              externalProps => (
                <div>
                  <ItalicButton {...externalProps} />
                  <BoldButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <CodeButton {...externalProps} />
                  <LinkButton {...externalProps} />
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <BlockquoteButton {...externalProps} />
                </div>
              )
            }
            </InlineToolbar>
          </div>
        )}
      </div>
    )
  }
}

export default MyEditor;
