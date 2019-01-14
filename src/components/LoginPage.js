import React from 'react';
import { connect } from 'react-redux';
import { startGoogleLogin, startFacebookLogin } from '../actions/auth';
import { APP_NAME, SLOGAN } from './../constants/constants'; 

export const LoginPage = ({ startGoogleLogin, startFacebookLogin }) => (
  <div className="box-layout">
    <div className="box-layout__box">
      <h1 className="box-layout__title favourite-font-weight">{ APP_NAME }</h1>
      <p>{ SLOGAN }</p>
      <button id="googleLoginButton" className="button mb1 button--warm-peach" onClick={startGoogleLogin}>Log in with Google</button>
      <button id="facebookLoginButton" className="button button--warm-peach" onClick={startFacebookLogin}>Log in with Facebook</button>
    </div>
  </div>
);

const mapDispatchToProps = (dispatch) => ({
  startGoogleLogin: () => dispatch(startGoogleLogin()),
  startFacebookLogin: () => dispatch(startFacebookLogin())
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
