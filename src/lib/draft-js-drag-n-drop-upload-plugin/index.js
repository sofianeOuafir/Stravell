export default ({handleUpload, addImage}) => {
  return {
    handleDroppedFiles: (selection, files, ref) => {
      handleUpload(files, (uploadedFile) => {
        const {Location, Key, Bucket} = uploadedFile;
        ref.setEditorState(addImage(ref.getEditorState(), Location));
      }, (err) => {
        alert(err);
      });
    }
  }
}