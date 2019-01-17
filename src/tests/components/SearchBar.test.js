import React from "react";
import { shallow } from "enzyme";
import { SearchBar } from "./../../components/SearchBar";

test('should render correctly', () => {
  const wrapper = shallow(<SearchBar filters={ { text:"" } } />);
  expect(wrapper).toMatchSnapshot();
});

test('should call setTextFilter when the text changes', () => {
  const text = 'How to travel the world with 10k';
  const eventObject = { target: { value: text } };
  const setTextFilter = jest.fn();
  const wrapper = shallow(<SearchBar filters={ { text:"" } } setTextFilter={setTextFilter} />);
  wrapper.find('#searchBarInput').simulate('change', eventObject);
  expect(setTextFilter).toHaveBeenCalledWith(text);
});