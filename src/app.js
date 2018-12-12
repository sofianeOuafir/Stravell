import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import "./styles/styles.scss";
import "normalize.css/normalize.css";
import "draft-js/dist/Draft.css";
import 'draft-js-undo-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-focus-plugin/lib/plugin.css';
import 'draft-js-alignment-plugin/lib/plugin.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import { firebase } from "./firebase/firebase";
import LoadingPage from "./components/LoadingPage";
import { login, logout } from "./actions/auth";
import AppRouter, { history } from "./routers/AppRouter";
import { startGetUser, startAddUser } from "./actions/users";
import { startSetPosts } from "./actions/posts";

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

ReactDOM.render(<LoadingPage />, document.getElementById("app"));
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
  });
});
