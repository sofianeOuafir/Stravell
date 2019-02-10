import React, { Fragment } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import {
  IoIosHome,
  IoIosPower,
  IoMdCreate,
  IoIosAirplane,
  IoIosLogIn,
  IoIosList
} from "react-icons/io";
import Avatar from "react-avatar";
import { slugify } from "underscore.string";
import Router from "next/router";

import { startLogout } from "../actions/auth";
import DropdownMenu from "./DropdownMenu";
import { APP_NAME } from "./../constants/constants";
import { setCountryFilter, setTextFilter } from "../actions/filters";

export const Header = ({
  startLogout,
  isAuthenticated,
  userName,
  userPhotoURL,
  clearFilters,
  uid
}) => {
  const AuthIndependentMenuElements = (
    <Fragment>
      <Link href="/">
        <button>
          <IoIosHome className="header__dropdown-menu-icon" />
          Home
        </button>
      </Link>
      <Link href="/destinations">
        <button>
          <IoIosAirplane className="header__dropdown-menu-icon" />
          Destinations
        </button>
      </Link>
    </Fragment>
  );
  return (
    <header className="header">
      <div className="content-container">
        <div className="header__content">
          <div
            onClick={() => {
              Router.push("/");
              clearFilters();
            }}
          >
            <a className="header__title">
              <h1>{APP_NAME}</h1>
            </a>
          </div>
          <div className="header__right">
            {isAuthenticated ? (
              <div className="header__right">
                <Link
                  prefetch
                  as={`/dashboard/${slugify(userName)}/${uid}`}
                  href={`/dashboard?uid=${uid}`}
                >
                  <Avatar
                    className="header__user-photo show-for-desktop"
                    round={true}
                    size="40"
                    src={userPhotoURL}
                  />
                </Link>
                <DropdownMenu title={userName}>
                  <Link prefetch as={"/p/create"} href="/createPost">
                    <button id="createButton">
                      <IoMdCreate className="header__dropdown-menu-icon" />{" "}
                      Create Post
                    </button>
                  </Link>
                  <Link
                    prefetch
                    as={`/dashboard/${slugify(userName)}/${uid}`}
                    href={`/dashboard?uid=${uid}`}
                  >
                    <button id="dashboardButton">
                      <IoIosList className="header__dropdown-menu-icon" />
                      Dashboard
                    </button>
                  </Link>
                  {AuthIndependentMenuElements}
                  <button id="logOutButton" onClick={startLogout}>
                    <IoIosPower className="header__dropdown-menu-icon" /> Log
                    Out
                  </button>
                </DropdownMenu>
              </div>
            ) : (
              <DropdownMenu title="Sign in to Stravell">
                <Link prefetch href="/login">
                  <button>
                    <IoIosLogIn className="header__dropdown-menu-icon" />
                    Log in
                  </button>
                </Link>
                {AuthIndependentMenuElements}
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout()),
  clearFilters: () => {
    dispatch(setCountryFilter(""));
    dispatch(setTextFilter(""));
  }
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
