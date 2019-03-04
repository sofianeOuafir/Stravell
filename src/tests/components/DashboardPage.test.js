import React from 'react';
import { shallow } from 'enzyme';
import { DashboardPage } from '../../components/DashboardPage';
import users from './../fixtures/users';

test('should render DashboardPage correctly', () => {
  const user = users[0];
  user.id = user.uid
  const wrapper = shallow(<DashboardPage user={user} />);
  expect(wrapper).toMatchSnapshot();
});
