import React from "react";

const PageHeader = ({ className, children, title }) => (
  <div className={className ? className : "page-header"}>
    <div className="content-container">
      {children ? children : <h1 className="page-header__title">{title}</h1>}
    </div>
  </div>
);

export default PageHeader;
