import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import Router, { withRouter } from "next/router";
import ReactGA from "react-ga";
import NProgress from 'nprogress'

import { startGetUser, startAddUser } from "../src/actions/users";
import withReduxStore from "../src/hocs/withReduxStore";
import { startSetPosts } from "../src/actions/posts";
import { firebase } from "./../src/firebase/firebase";
import { login, logout } from "./../src/actions/auth";
import { setTextFilter } from "./../src/actions/filters";
import "./../src/styles/styles.scss";
import "normalize.css/normalize.css";
import "draft-js/dist/Draft.css";
import "draft-js-undo-plugin/lib/plugin.css";
import "draft-js-image-plugin/lib/plugin.css";
import "draft-js-focus-plugin/lib/plugin.css";
import "draft-js-alignment-plugin/lib/plugin.css";
import "draft-js-linkify-plugin/lib/plugin.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";

class MyApp extends App {
  componentDidMount() {
    const searchQuery = Router.query.s;
    if (searchQuery) {
      this.props.reduxStore.dispatch(setTextFilter(searchQuery));
    }

    // initialize React Google Analytics and track page views
    ReactGA.initialize(process.env.GA_TRACKING_CODE);
    ReactGA.pageview(Router.route);
    Router.events.on('routeChangeStart', (location) => {
      ReactGA.pageview(location);
      NProgress.start();
    });

    Router.events.on('routeChangeComplete', () => NProgress.done())
    Router.events.on('routeChangeError', () => NProgress.done())

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        return user
          .getIdToken()
          .then(token => {
            return fetch("/api/login", {
              method: "POST",
              headers: new Headers({ "Content-Type": "application/json" }),
              credentials: "same-origin",
              body: JSON.stringify({ token })
            });
          })
          .then(() => {
            const {
              uid,
              displayName: userName,
              photoURL: userPhotoURL,
              email
            } = user;
            this.props.reduxStore.dispatch(
              login({ uid, userName, userPhotoURL })
            );
            this.props.reduxStore.dispatch(startGetUser(uid)).then(snapshot => {
              if (snapshot.val() === null) {
                this.props.reduxStore.dispatch(startAddUser({ userName, uid, userPhotoURL, email }));
              }
            });

            if (this.props.router.route === "/login")
              this.props.router.push("/");
          });
      } else {
        fetch("/api/logout", {
          method: "POST",
          credentials: "same-origin"
        }).then(() => {
          this.props.reduxStore.dispatch(logout());
        });
      }
    });
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(withRouter(MyApp));
