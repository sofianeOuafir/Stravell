import App, { Container } from 'next/app';
import React from 'react';
import withReduxStore from '../src/lib/with-redux-store';
import { Provider } from 'react-redux';
import { startSetPosts } from "../src/actions/posts";
import { firebase } from "./../src/firebase/firebase";
import { login, logout } from "./../src/actions/auth";
import "./../src/styles/styles.scss";
import "normalize.css/normalize.css";
import "draft-js/dist/Draft.css";
import "draft-js-undo-plugin/lib/plugin.css";
import "draft-js-image-plugin/lib/plugin.css";
import "draft-js-focus-plugin/lib/plugin.css";
import "draft-js-alignment-plugin/lib/plugin.css";
import "draft-js-linkify-plugin/lib/plugin.css";
import 'draft-js-side-toolbar-plugin/lib/plugin.css';

class MyApp extends App {
  componentDidMount () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const {
          uid,
          displayName: userName,
          photoURL: userPhotoURL,
          email
        } = user;
        this.props.reduxStore.dispatch(login({ uid, userName, userPhotoURL }));
      } else {
        this.props.reduxStore.dispatch(logout());
      }
    })
  }

  render () {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
