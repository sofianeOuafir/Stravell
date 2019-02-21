import React, { Fragment } from "react";
import Link from 'next/link';

const Breadcrumb = ({ links }) => (
  <Fragment>
    {links &&
      // linkProps would be "href" and "as" props
      links.map(({ text, ...linkProps }) => {
        if (linkProps.href && text) {
          return (
            <Link {...linkProps}>
              <a>{text}</a>
            </Link>
          );
        }
      })}
  </Fragment>
);

export default Breadcrumb;
