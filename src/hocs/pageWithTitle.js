import React from "react";
import { Helmet } from "react-helmet";

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
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
          </Helmet>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};
