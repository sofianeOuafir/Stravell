import React from 'react';
import { shallow } from 'enzyme';
import { EditorState } from "draft-js";
import MyEditor from './../../components/MyEditor';


const editorState = EditorState.createEmpty();
let props = { editorState, onChange: () => {} };

describe('editor is read only', () => {
  test('should render correctly', () => {
    props.readOnly = true;
    const wrapper = shallow(<MyEditor { ...props } />)
    expect(wrapper).toMatchSnapshot()
  });
});

describe('editor is not read only', () => {
  test('should render correctly', () => {
    props.readOnly = false;
    const wrapper = shallow(<MyEditor { ...props } />)
    expect(wrapper).toMatchSnapshot()
  });
});