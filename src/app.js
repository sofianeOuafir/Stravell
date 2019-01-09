import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import ReactGA from 'react-ga';
import qs from 'query-string';
import "./styles/styles.scss";
import "normalize.css/normalize.css";
import "draft-js/dist/Draft.css";
import "draft-js-undo-plugin/lib/plugin.css";
import "draft-js-image-plugin/lib/plugin.css";
import "draft-js-focus-plugin/lib/plugin.css";
import "draft-js-alignment-plugin/lib/plugin.css";
import "draft-js-linkify-plugin/lib/plugin.css";
import 'draft-js-side-toolbar-plugin/lib/plugin.css';
import { firebase } from "./firebase/firebase";
import Loading from "./components/Loading";
import { login, logout } from "./actions/auth";
import AppRouter, { history } from "./routers/AppRouter";
import { startGetUser, startAddUser } from "./actions/users";
import { startSetPosts } from "./actions/posts";
import { setTextFilter } from './actions/filters';

const store = configureStore();
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById("app"));
    hasRendered = true;
  }
};

ReactDOM.render(
  <div className="loading-container">
    <Loading size="big" />
  </div>,
  document.getElementById("app")
);
firebase.auth().onAuthStateChanged(user => {
  store.dispatch(startSetPosts()).then(() => {
    if (user) {
      const {
        uid,
        displayName: userName,
        photoURL: userPhotoURL,
        email
      } = user;
      store.dispatch(startGetUser(uid)).then(snapshot => {
        if (snapshot.val() === null) {
          store.dispatch(startAddUser({ userName, uid, userPhotoURL, email }));
        }
      });
      store.dispatch(login({ uid, userName, userPhotoURL }));
      renderApp();
    } else {
      store.dispatch(logout());
      renderApp();
    }
  }).catch(() => {});
});

// initialize React Google Analytics and track page views
ReactGA.initialize(process.env.GA_TRACKING_CODE);
history.listen(location => {
  ReactGA.pageview(location.pathname)
});

const queryStringObject = qs.parse(history.location.search);
const searchQuery = queryStringObject.s;
if(searchQuery) {
  store.dispatch(setTextFilter(searchQuery));
}