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
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import { FaImages } from 'react-icons/fa';
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

const sideToolbarPlugin = createSideToolbarPlugin();
const linkPlugin = createLinkPlugin();
const undoPlugin = createUndoPlugin();
const alignmentPlugin = createAlignmentPlugin();
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const linkifyPlugin = createLinkifyPlugin({ target: '_blank' });

const { SideToolbar } = sideToolbarPlugin;
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

export const plugins = [
  sideToolbarPlugin,
  linkifyPlugin,
  linkPlugin,
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
    const { editorState, ...rest } = props;
    this.state = {
      editorState
    };
    this.rest = rest;
  }

  focus = () => {
    this.editor.focus();
  };

  componentWillReceiveProps(newProps) {
    this.setState({editorState: newProps.editorState});
  }

  triggerPopupForUpload = (e) => {
    e.preventDefault();
    document.getElementById('imageUploads').click();
  }

  uploadImage = (e) => {
    const file = e.target.files[0];
    uploadFile({ file, location: `pictures/${this.props.s3FolderName}` })
    .then(({ Location }) => {
      this.setState(() => ({ editorState: imagePlugin.addImage(this.state.editorState, Location) }));
    })
    .catch(err => {
      alert(err);
    });
  }

  render() {
    return (
      <div onClick={this.focus} className={!this.props.readOnly ? "editor-container" : "" } >
        <input type="file" id="imageUploads" className="hide" onChange={this.uploadImage} />
        <Editor
          plugins={plugins}
          editorState={this.state.editorState}
          {...this.rest}
  
          ref={element => {
            this.editor = element;
          }}
        />
        {!this.props.readOnly && (
          <div>
            <AlignmentTool />
            <SideToolbar>
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
                  <div className="draftJsToolbar__buttonWrapper__1Dmqh">
                    <button className="draftJsToolbar__button__qi1gf" onClick={this.triggerPopupForUpload}><FaImages/></button>                  
                  </div>
                </div>
              )
            }
            </SideToolbar>
          </div>
        )}
      </div>
    )
  }
}

export default MyEditor;
