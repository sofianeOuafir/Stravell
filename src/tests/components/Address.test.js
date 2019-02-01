import React from "react";
import { shallow } from "enzyme";
import Address from "../../components/Address";

describe("without iconClassName or addressClassName props", () => {
  test("should render correctly", () => {
    const wrapper = shallow(<Address address="Monaco" />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("with iconClassName or addressClassName props", () => {
  test("should render correctly", () => {
    const wrapper = shallow(
      <Address
        iconClassName="my-css-class"
        addressClassName="my-css-class"
        address="Monaco"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
