import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import authReducer from '../reducers/auth';
import postsReducer from '../reducers/posts';
import filtersReducer from '../reducers/filters';
import countriesReducer from '../reducers/countries';
import mapReducer from '../reducers/map';
import placesReducer from '../reducers/places';

let composeEnhancers;
try {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} catch {
  composeEnhancers = compose;
}


export default function (initData) {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      posts: postsReducer,
      filters: filtersReducer,
      countries: countriesReducer,
      mapConfig: mapReducer,
      places: placesReducer
    }),
    initData,
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
