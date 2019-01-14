import React from 'react';
import { shallow } from 'enzyme';
import { LoginPage } from '../../components/LoginPage';

test('should correctly render LoginPage', () => {
  const wrapper = shallow(<LoginPage />);
  expect(wrapper).toMatchSnapshot();
});

test('should call startGoogleLogin on button click', () => {
  const startGoogleLogin = jest.fn();
  const wrapper = shallow(<LoginPage startGoogleLogin={startGoogleLogin} />);
  wrapper.find('#googleLoginButton').simulate('click');
  expect(startGoogleLogin).toHaveBeenCalled();
});

test('should call startFacebookLogin on button click', () => {
  const startFacebookLogin = jest.fn();
  const wrapper = shallow(<LoginPage startFacebookLogin={startFacebookLogin} />);
  wrapper.find('#facebookLoginButton').simulate('click');
  expect(startFacebookLogin).toHaveBeenCalled();
});
