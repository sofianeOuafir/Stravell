import React from "react";
import { shallow } from "enzyme";
import Breadcrumb from "../../components/Breadcrumb";

test("should render correctly when passing links props with valid link", () => {
  const links = [
    { href: "/home", text: "Home", active: true },
    { href: "/destinations", text: "Destinations", active: false }
  ];

  const wrapper = shallow(<Breadcrumb links={links} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render correctly when passing links props with link containing no text", () => {
  const links = [
    { href: "/home", text: "", active: true },
    { href: "/destinations", text: "", active: false }
  ];

  const wrapper = shallow(<Breadcrumb links={links} />);
  expect(wrapper).toMatchSnapshot();
});
