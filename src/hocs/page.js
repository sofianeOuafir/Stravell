import React from "react";
import Head from 'next/head';
import Header from './../components/Header';

// This function takes a component...
export default (WrappedComponent, { title, description }) => {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div>
          <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
          </Head>
          <Header />
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};
