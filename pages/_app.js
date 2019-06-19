import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import Router, { withRouter } from "next/router";
import ReactGA from "react-ga";
import NProgress from "nprogress";
import { hotjar } from "react-hotjar";

import withReduxStore from "../src/hocs/withReduxStore";
import { firebase } from "./../src/firebase/firebase";
import { login, logout } from "./../src/actions/auth";
import { getUser, addUser } from "../src/queries/user";
import "./../src/styles/styles.scss";
import "normalize.css/normalize.css";
import "draft-js/dist/Draft.css";
import "draft-js-undo-plugin/lib/plugin.css";
import "draft-js-image-plugin/lib/plugin.css";
import "draft-js-focus-plugin/lib/plugin.css";
import "draft-js-alignment-plugin/lib/plugin.css";
import "draft-js-linkify-plugin/lib/plugin.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";
import { setTextFilter } from "./../src/actions/filters";

class MyApp extends App {
  async componentDidMount() {
    const { reduxStore } = this.props;
    // initialize React Google Analytics and track page views
    ReactGA.initialize(process.env.GA_TRACKING_CODE);
    ReactGA.pageview(Router.route);
    Router.events.on("routeChangeStart", location => {
      ReactGA.pageview(location);
      NProgress.start();
    });

    hotjar.initialize(process.env.HOTJAR_ID, 6);

    Router.events.on("routeChangeComplete", () => {
      reduxStore.dispatch(setTextFilter(""));
      NProgress.done();
    });
    Router.events.on("routeChangeError", () => NProgress.done());
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
          .then(async () => {
            const { uid } = user;
            const userResult = await getUser(uid);
            let userName, userPhotoURL, email

            if (userResult === null) {
               ({
                displayName: userName,
                photoURL: userPhotoURL,
                email
              } = user);

              addUser({ userName, uid, userPhotoURL, email });
            } else {
              ({ userName, userPhotoURL, email } = userResult);
            }

            this.props.reduxStore.dispatch(
              login({ uid, userName, userPhotoURL })
            );

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
