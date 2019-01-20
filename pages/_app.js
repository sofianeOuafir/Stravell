import App, { Container } from 'next/app';
import React from 'react';
import withReduxStore from '../src/lib/with-redux-store';
import { Provider } from 'react-redux';
import Loading from "../src/components/Loading";
import { startSetPosts } from "../src/actions/posts";

class MyApp extends App {
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
