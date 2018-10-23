import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { startLogout } from "../actions/auth";

export const Header = ({ startLogout, isAuthenticated }) => (
  <header className="header">
    <div className="content-container">
      <div className="header__content">
        <Link className="header__title" to="/">
          <h1>Blog</h1>
        </Link>
        {isAuthenticated && (
          <Link className="header__title" to="/dashboard">
            <h1>Dashboard</h1>
          </Link>
        )}

        {isAuthenticated ? (
          <button className="button button--link" onClick={startLogout}>
            Logout
          </button>
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
    isAuthenticated: !!state.auth.uid
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
