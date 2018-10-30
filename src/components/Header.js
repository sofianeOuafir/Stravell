import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IoIosHome, IoIosPower } from 'react-icons/io';
import Avatar from "react-avatar";
import { startLogout } from "../actions/auth";
import SearchBar from "./SearchBar";
import DropdownMenu from "./DropdownMenu";
import { history } from "./../routers/AppRouter";

export const Header = ({
  startLogout,
  isAuthenticated,
  userName,
  userPhotoURL,
  redirectToDashboard
}) => (
  <header className="header">
    <div className="content-container">
      <div className="header__content">
        <Link className="header__title" to="/">
          <h1>Wanderlust</h1>
        </Link>

        {isAuthenticated ? (
          <div className="header__right">
            <SearchBar
              placeholder="Search"
              className="search-bar header__search-bar show-for-desktop"
              autoFocus={true}
            />
            <Link to="/dashboard" className="header__user-photo show-for-desktop">
              <Avatar round={true} size="40" src={userPhotoURL} />
            </Link>
            <DropdownMenu title={userName}>
              <button onClick={redirectToDashboard}> <IoIosHome className="header__dropdown-menu-icon" /> Dashboard</button>
              <button onClick={startLogout}> <IoIosPower className="header__dropdown-menu-icon" /> Log Out</button>
            </DropdownMenu>
          </div>
        ) : (
          <Link className="button button--link" to="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  </header>
);

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout()),
  redirectToDashboard: () => history.push("/dashboard")
});

const mapStateToProps = state => {
  return {
    isAuthenticated: !!state.auth.uid,
    userName: state.auth.userName,
    userPhotoURL: state.auth.userPhotoURL
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
