import React from 'react';
import { connect } from 'react-redux';
import { startLogin, startFacebookLogin } from '../actions/auth';
import { APP_NAME, SLOGAN } from './../constants/constants'; 

export const LoginPage = ({ startLogin, startFacebookLogin }) => (
  <div className="box-layout">
    <div className="box-layout__box">
      <h1 className="box-layout__title favourite-font-weight">{ APP_NAME }</h1>
      <p>{ SLOGAN }</p>
      <button id="googleLoginButton" className="button mb1 button--warm-peach" onClick={startLogin}>Log in with Google</button>
      <button className="button button--warm-peach" onClick={startFacebookLogin}>Log in with Facebook</button>
    </div>
  </div>
);

const mapDispatchToProps = (dispatch) => ({
  startLogin: () => dispatch(startLogin()),
  startFacebookLogin: () => dispatch(startFacebookLogin())
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
