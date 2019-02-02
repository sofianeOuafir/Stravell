import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import authReducer from '../reducers/auth';
import postsReducer from '../reducers/posts';
import filtersReducer from '../reducers/filters';
import countriesReducer from '../reducers/countries';

let composeEnhancers;
try {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} catch {
  composeEnhancers = compose;
}


export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      posts: postsReducer,
      filters: filtersReducer,
      countries: countriesReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
