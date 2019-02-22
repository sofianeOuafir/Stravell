import React, { Fragment } from "react";
import Link from "next/link";

const Breadcrumb = ({ links }) => (
  <div>
    {links &&
      // linkProps would be "href" and "as" props
      links.map(({ text, ...linkProps }, index) => {
        if (linkProps.href && text) {
          return (
            <Link key={index} {...linkProps}>
              <a className="text-dark-grey no-text-decoration">
                <span className="mr1">{text}</span>
                {links.length !== index + 1 && <span className="mr1">/</span>}
              </a>
            </Link>
          );
        }
      })}
  </div>
);

export default Breadcrumb;
