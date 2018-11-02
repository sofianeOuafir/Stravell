import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import './styles/styles.scss';
import 'normalize.css/normalize.css';
import 'draft-js/dist/Draft.css';
import 'megadraft/dist/css/megadraft.css';
import { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';
import { login, logout } from './actions/auth';
import AppRouter, { history } from './routers/AppRouter';
import { addPost } from './actions/posts';
import { startGetUser, startAddUser } from './actions/users';

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
    const { uid, displayName: userName, photoURL: userPhotoURL, email } = user;
    store.dispatch(startGetUser(uid)).then((snapshot) => {
      if(snapshot.val() === null) {
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
