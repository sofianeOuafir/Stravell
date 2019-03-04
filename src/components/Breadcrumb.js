import React from "react";
import Link from "next/link";

const Breadcrumb = ({ links }) => (
  <div>
    {links &&
      // linkProps would be "href" and "as" props
      links.map(({ text, active, ...linkProps }, index) => {
        if (linkProps.href && text) {
          return (
            <Link prefetch key={index} {...linkProps}>
              <a className="breadcrumb__link">
                <span
                  className={`breadcrumb__link-text ${
                    active ? "breadcrumb__link-text--active" : ""
                  }`}
                >
                  {text}
                </span>
                {!isLastLink({
                  arrayLength: links.length,
                  currentIndex: index
                }) && <span className="mr1">/</span>}
              </a>
            </Link>
          );
        }
      })}
  </div>
);

const isLastLink = ({ arrayLength, currentIndex }) =>
  arrayLength === currentIndex + 1;

export default Breadcrumb;
