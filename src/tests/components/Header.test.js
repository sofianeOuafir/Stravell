import React from "react";
import { shallow } from "enzyme";
import { Header } from "../../components/Header";

describe("A user is authenticated", () => {
  const history = { push: jest.fn() }
  const startLogout = jest.fn();
  let props = {
    isAuthenticated: true,
    userName: "Sofiane",
    userPhotoURL: "myPhotoURL",
    redirectToDashboard: () => { history.push('/dashboard') },
    redirectToCreatePost: () => { history.push('/posts/create') },
    startLogout
  };
  const wrapper = shallow(<Header {...props} />);

  test("should render Header correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("should redirect to dashboard when clicking on dashboard button", () => {
    wrapper.find('#dashboardButton').simulate("click");
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

  test("should redirect to add page when clicking on create button", () => {
    wrapper.find('#createButton').simulate("click");
    expect(history.push).toHaveBeenCalledWith('/posts/create');
  });

  test("should call startLogout on button click", () => {
    wrapper.find("#logOutButton").simulate("click");
    expect(startLogout).toHaveBeenCalled();
  });
});

describe("There is no user authenticated", () => {
  test("should render Header correctly", () => {
    const wrapper = shallow(<Header startLogout={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});


