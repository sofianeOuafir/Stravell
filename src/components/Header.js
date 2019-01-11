import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IoIosHome, IoIosPower, IoMdCreate } from "react-icons/io";
import Avatar from "react-avatar";
import { startLogout } from "../actions/auth";
import DropdownMenu from "./DropdownMenu";
import { history } from "./../routers/AppRouter";
import { APP_NAME } from './../constants/constants';

export const Header = ({
  startLogout,
  isAuthenticated,
  userName,
  userPhotoURL,
  redirectToDashboard,
  redirectToCreatePost
}) => (
  <header className="header">
    <div className="content-container">
      <div className="header__content">
        <Link className="header__title" to="/">
          <h1>{APP_NAME}</h1>
        </Link>
        <div className="header__right">
          {isAuthenticated ? (
            <div className="header__right">
              <Link
                to="/dashboard"
                className="header__user-photo show-for-desktop"
              >
                <Avatar round={true} size="40" src={userPhotoURL} />
              </Link>
              <DropdownMenu title={userName}>
                <button id="createButton" onClick={redirectToCreatePost}>
                  <IoMdCreate className="header__dropdown-menu-icon" /> Create Post
                </button>
                <button id="dashboardButton" onClick={redirectToDashboard}>
                  <IoIosHome className="header__dropdown-menu-icon" /> Dashboard
                </button>
                <button id="logOutButton" onClick={startLogout}>
                  <IoIosPower className="header__dropdown-menu-icon" /> Log Out
                </button>
              </DropdownMenu>
            </div>
          ) : (
            <Link className="button button--link" to="/login">
              Log in
            </Link>
          )}
        </div>
      </div>
    </div>
  </header>
);

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout()),
  redirectToDashboard: () => history.push("/dashboard"),
  redirectToCreatePost: () => history.push("/posts/create")
});

const mapStateToProps = ({ auth }) => {
  return {
    isAuthenticated: !!auth.uid,
    userName: auth.userName,
    userPhotoURL: auth.userPhotoURL
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
