import React from "react";
import Link from "next/link";

import Layout from "./../src/components/Layout";
import PageHeader from "./../src/components/PageHeader";


export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    let errorExplanation;
    if (this.props.statusCode === 404) {
      errorExplanation = "Oops! This page could not be found.";
    } else if (this.props.statusCode === 500) {
      errorExplanation = "Oops! Internal Server Error.";
    } else {
      errorExplanation = "Oops! An error occured";
    }
    const error = `${this.props.statusCode}: ${errorExplanation}`;
    return (
      <Layout title={`${error}`} description={`${error}`}>
        <PageHeader title={`${error}`} />
        <div className="flex align-items--center justify-content--center my2 py2">
          <div className="funny-text-container dashed-border center my2 py2 flex justify-content--center flex-direction--column">
            <h1 className="favourite-font-weight">It looks like you were stravelling a bit too fast!</h1>
            <div>
              <Link href="/">
                <a className="button">Back Home</a>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
