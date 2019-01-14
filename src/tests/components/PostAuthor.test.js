import React from 'react';
import { shallow } from 'enzyme';
import PostAuthor from './../../components/PostAuthor';
import uuid from 'uuid';
import users from './../fixtures/users';

test('should render correctly', () => {
  const { uid: authorUid, userPhotoURL: authorPhotoURL, userName: authorName, avatarSize = 40 } = users[0];
  const props = { authorUid, authorPhotoURL, authorName, avatarSize };
  const wrapper = shallow(<PostAuthor { ...props } />);
  expect(wrapper).toMatchSnapshot();
});