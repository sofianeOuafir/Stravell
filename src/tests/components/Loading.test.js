import React from 'react';
import { shallow } from 'enzyme';
import Loading from '../../components/Loading';

test('should correctly render LoadingPage', () => {
  const wrapper = shallow(<Loading />);
  expect(wrapper).toMatchSnapshot();
});
