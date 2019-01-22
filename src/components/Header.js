import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { IoIosHome, IoIosPower, IoMdCreate } from "react-icons/io";
import Avatar from "react-avatar";

import { startLogout } from "../actions/auth";
import DropdownMenu from "./DropdownMenu";
import { APP_NAME } from './../constants/constants';

export const Header = ({
  startLogout,
  isAuthenticated,
  userName,
  userPhotoURL,
  uid
}) => (
  <header className="header">
    <div className="content-container">
      <div className="header__content">
        <Link prefetch href="/">
          <a className="header__title">
            <h1>{APP_NAME}</h1>
          </a>
        </Link>
        <div className="header__right">
          {isAuthenticated ? (
            <div className="header__right">
              <Link
                href={`/dashboard?uid=${uid}`}
                
              >
                <Avatar className="header__user-photo show-for-desktop" round={true} size="40" src={userPhotoURL} />
              </Link>
              <DropdownMenu title={userName}>
                <Link prefetch href="/createPost">
                  <button id="createButton">
                    <IoMdCreate className="header__dropdown-menu-icon" /> Create Post
                  </button>
                </Link>
                <Link prefetch href={`/dashboard?uid=${uid}`}>
                  <button id="dashboardButton">
                    <IoIosHome className="header__dropdown-menu-icon" /> Dashboard
                  </button>
                </Link>
                <button id="logOutButton" onClick={startLogout}>
                  <IoIosPower className="header__dropdown-menu-icon" /> Log Out
                </button>
              </DropdownMenu>
            </div>
          ) : (
            <Link prefetch href="/login">
              <a className="button button--link">Log in</a>
            </Link>
          )}
        </div>
      </div>
    </div>
  </header>
);

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout())
});

const mapStateToProps = ({ auth }) => {
  return {
    uid: auth.uid,
    isAuthenticated: !!auth.uid,
    userName: auth.userName,
    userPhotoURL: auth.userPhotoURL
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
