import React from 'react';
import { shallow } from 'enzyme';
import PageHeader from './../../components/PageHeader';

describe('the component is rendered with a title prop', () => {
  test('should render correctly', () => {
    const props = { title: 'My amazing title' };
    const wrapper = shallow(<PageHeader { ...props } />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('the component is rendered with a prop withSocialShareButtons = false', () => {
  test('should render correctly', () => {
    const props = { title: 'My amazing title', withSocialShareButtons: false };
    const wrapper = shallow(<PageHeader { ...props } />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('the component is rendering the social share buttons by default', () => {
  test('should render correctly', () => {
    const props = { title: 'My amazing title' };
    const wrapper = shallow(<PageHeader { ...props } />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('the component is rendered with a children prop', () => {
  test('should render correctly', () => {
    const component = (
      <PageHeader>
        <p>My amazing children</p>
      </PageHeader>
    );
    const wrapper = shallow(component);
    expect(wrapper).toMatchSnapshot();
  });
});