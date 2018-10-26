import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import './styles/styles.scss';
import 'normalize.css/normalize.css';
import 'draft-js/dist/Draft.css';
import { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';
import { login, logout } from './actions/auth';
import AppRouter, { history } from './routers/AppRouter';
import { addPost } from './actions/posts';

const store = configureStore();
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    const { uid, displayName: userName, photoURL: userPhotoURL } = user;
    store.dispatch(login({ uid, userName, userPhotoURL }));
    renderApp();
  } else {
    store.dispatch(logout());
    renderApp();
  }
});
