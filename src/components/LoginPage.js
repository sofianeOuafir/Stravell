import React from "react";
import { connect } from "react-redux";

import { startGoogleLogin, startFacebookLogin } from "../actions/auth";
import {
  APP_NAME,
  SLOGAN,
  LOG_IN_PAGE_TITLE,
  LOG_IN_PAGE_DESCRIPTION
} from "./../constants/constants";
import Layout from "./Layout";

export const LoginPage = props => {
  return (
    <Layout title={LOG_IN_PAGE_TITLE} description={LOG_IN_PAGE_DESCRIPTION}>
      <div className="box-layout">
        <div className="box-layout__box">
          <h1 className="box-layout__title favourite-font-weight">
            {APP_NAME}
          </h1>
          <p>{SLOGAN}</p>
          <button
            id="googleLoginButton"
            className="button mb1 button--warm-peach"
            onClick={props.startGoogleLogin}
          >
            Log in with Google
          </button>
          <button
            id="facebookLoginButton"
            className="button button--warm-peach"
            onClick={props.startFacebookLogin}
          >
            Log in with Facebook
          </button>
        </div>
      </div>
    </Layout>
  );
};

const mapDispatchToProps = dispatch => ({
  startGoogleLogin: () => dispatch(startGoogleLogin()),
  startFacebookLogin: () => dispatch(startFacebookLogin())
});

export default connect(
  null,
  mapDispatchToProps
)(LoginPage);
