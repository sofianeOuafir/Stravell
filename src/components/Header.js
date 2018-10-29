import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Avatar from 'react-avatar';
import { startLogout } from "../actions/auth";
import SearchBar from './SearchBar';

export const Header = ({
  startLogout,
  isAuthenticated,
  userName,
  userPhotoURL
}) => (
  <header className="header">
    <div className="content-container">
      <div className="header__content">
        <Link className="header__title" to="/">
          <h1>Lustderwan</h1>
        </Link>

        {isAuthenticated ? (
          <div>
            <SearchBar placeholder="Search" className="search-bar--header show-for-desktop" autoFocus={true} />
            <Link to="/dashboard" className="header__user-photo">
              <Avatar round={true} size="40" src={userPhotoURL} />
            </Link>
            <span className="header__user-name">{userName}</span>
            {/*<button className="button button--link" onClick={startLogout}>
              Logout
              </button>*/}
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
  startLogout: () => dispatch(startLogout())
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
