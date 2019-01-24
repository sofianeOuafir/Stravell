import React from "react";
import Head from "next/head";

import Header from './Header';

const Layout = ({ withTitleAndDescription = true, title, description, children }) => (
  <div>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" href="/static/images/favicon.png" />

    {withTitleAndDescription && (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
    )}

    <Header />
    {children}
  </div>
);

export default Layout;
