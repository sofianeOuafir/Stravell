import React from "react";
import { shallow } from "enzyme";
import Layout from "./../../components/Layout";

describe('a title and description are provided', () => {
  test('should render correctly', () => {
    const wrapper = shallow(<Layout title="my title" description="my description"><p>hello</p></Layout>);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('not title and description are provided', () => {
  test('should render correctly', () => {
    const wrapper = shallow(<Layout withTitleAndDescription={false}><p>hello</p></Layout>);
    expect(wrapper).toMatchSnapshot();
  });
});

