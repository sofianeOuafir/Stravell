import React from "react";
import Head from "next/head";

import Footer from './Footer';
import Header from './Header';

const Layout = ({ withTitleAndDescription = true, title, description, children }) => (
  <div>
    {withTitleAndDescription && (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
    )}

    <Header />
    <div className="header__margin-top">
      {children}
    </div>
    
    <Footer />
  </div>
);

export default Layout;
