import React from "react";
import { shallow } from "enzyme";
import { SocialShareButtons } from "./../../components/SocialShareButtons";

test('should render correctly', () => {
  const wrapper = shallow(<SocialShareButtons router={ { asPath: '/' } } />);
  expect(wrapper).toMatchSnapshot();
});