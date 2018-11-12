export default ({handleUpload, addImage}) => {
  return {
    handleDroppedFiles: (selection, files, ref) => {
      handleUpload(files, () => {
        // call callback with uploadedFile as an argument
        console.log('yaaay');
        // add uploaded files to editor here 
      });
    }
  }
}