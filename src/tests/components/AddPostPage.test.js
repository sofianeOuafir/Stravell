import React from 'react';
import { shallow } from 'enzyme';
import { AddPostPage } from '../../components/AddPostPage';

test('should render correctly', () => {
  const wrapper = shallow(<AddPostPage />);
  expect(wrapper).toMatchSnapshot();
});