import React from "react";
import SocialShareButtons from './SocialShareButtons';

const PageHeader = ({ className, children, title, withSocialShareButtons = true }) => (
  <div className={className ? className : "page-header"}>
    <div className="content-container">
      {children ? children : <h1 className="page-header__title">{title}</h1>}
      { withSocialShareButtons && (
        <div className="mt1 border-top pt1 border--light-grey">
        <SocialShareButtons />
      </div>
      ) }

    </div>
  </div>
);

export default PageHeader;
