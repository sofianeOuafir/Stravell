import React from "react";
import { Router, Route, Switch, Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import createHistory from "history/createBrowserHistory";
import DashboardPage from "../components/DashboardPage";
import NotFoundPage from "../components/NotFoundPage";
import LoginPage from "../components/LoginPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import HomePage from "../components/HomePage";
import Header from "../components/Header";
import AddPostPage from "../components/AddPostPage";
import EditPostPage from "../components/EditPostPage";
import ShowPostPage from "../components/ShowPostPage";
import UserWallPage from "../components/UserWallPage";
import * as Constants from "./../constants/constants";
import withTitle from "./../hocs/pageWithTitle";

export const history = createHistory();
const {
  HOME_PAGE_TITLE,
  LOG_IN_PAGE_TITLE,
  DASHBOARD_PAGE_TITLE,
  APP_POST_PAGE_TITLE,
  EDIT_POST_PAGE_TITLE,
  NOT_FOUND_PAGE_TITLE,
  USER_WALL_PAGE_TITLE,

  HOME_PAGE_DESCRIPTION,
  LOG_IN_PAGE_DESCRIPTION,
  DASHBOARD_PAGE_DESCRIPTION,
  APP_POST_PAGE_DESCRIPTION,
  EDIT_POST_PAGE_DESCRIPTION,
  NOT_FOUND_PAGE_DESCRIPTION,
  USER_WALL_PAGE_DESCRIPTION
} = Constants;

const HomePageWithTitle = withTitle(HomePage, { title: HOME_PAGE_TITLE, description: HOME_PAGE_DESCRIPTION });
const LoginPageWithTitle = withTitle(LoginPage, { title: LOG_IN_PAGE_TITLE, description: LOG_IN_PAGE_DESCRIPTION });
const DashboardPageWithTitle = withTitle(DashboardPage, {
  title: DASHBOARD_PAGE_TITLE,
  description: DASHBOARD_PAGE_DESCRIPTION
});
const AddPostPageWithTitle = withTitle(AddPostPage, {
  title: APP_POST_PAGE_TITLE,
  description: APP_POST_PAGE_DESCRIPTION
});
const EditPostPageWithTitle = withTitle(EditPostPage, {
  title: EDIT_POST_PAGE_TITLE,
  description: EDIT_POST_PAGE_DESCRIPTION
});
const NotFoundPageWithTitle = withTitle(NotFoundPage, {
  title: NOT_FOUND_PAGE_TITLE,
  description: NOT_FOUND_PAGE_DESCRIPTION
});
const UserWallPageWithTitle = withTitle(UserWallPage, {
  title: USER_WALL_PAGE_TITLE,
  description: USER_WALL_PAGE_DESCRIPTION
});

const AppRouter = props => (
  <Router history={history}>
    <div>
      <Header />
      <Switch>
        <PublicRoute path="/" component={HomePageWithTitle} exact={true} />
        <PublicRoute path="/login" component={LoginPageWithTitle} />
        <PublicRoute path="/users/:uid" component={UserWallPageWithTitle} />
        <PublicRoute path="/posts/show/:id" component={ShowPostPage} />
        <PrivateRoute path="/dashboard" component={DashboardPageWithTitle} />
        <PrivateRoute path="/posts/create" component={AddPostPageWithTitle} />
        <PrivateRoute
          path="/posts/edit/:id"
          component={EditPostPageWithTitle}
        />
        <Route component={NotFoundPageWithTitle} />
      </Switch>
    </div>
  </Router>
);

export default connect()(AppRouter);
