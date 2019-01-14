import React from 'react';
import { shallow } from 'enzyme';
import { AddPostPage } from '../../components/AddPostPage';
import { PostForm } from './../../components/PostForm';

const startAddPost = jest.fn();
const history = { push: jest.fn() };
const props = { startAddPost, history };
let wrapper;

beforeEach(() => {
  wrapper = shallow(<AddPostPage { ...props } />);
});

test('should render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should add the post and redirect the user to the dashboard when the form get submitted', () => {
  wrapper.find(PostForm).simulate('submit', { });
  expect(startAddPost).toHaveBeenCalled();
  expect(history.push).toHaveBeenCalledWith('/dashboard');
});