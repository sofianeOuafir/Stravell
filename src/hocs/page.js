import React from "react";
import Head from "next/head";
import Header from "./../components/Header";

// This function takes a component...
export default (
  WrappedComponent,
  { title, description, withTitleAndDescription = true }
) => {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" href="/static/images/favicon.png" />
          <Head>
            {withTitleAndDescription && (
              <div>
                <title>{title}</title>
                <meta name="description" content={description} />
              </div>
            )}
          </Head>
          <Header />
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};
