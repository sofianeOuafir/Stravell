import React from "react";
import { connect } from "react-redux";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { firebase, auth } from './../firebase/firebase';

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};

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
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
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
