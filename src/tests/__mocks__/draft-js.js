const draftJs = require.requireActual('draft-js');
let EditorState = draftJs.EditorState;
const convertFromRaw = draftJs.convertFromRaw;
const convertToRaw = draftJs.convertToRaw;
const CompositeDecorator = draftJs.CompositeDecorator;
EditorState.createEmpty = () => ({});

export { EditorState, convertFromRaw, convertToRaw, CompositeDecorator };