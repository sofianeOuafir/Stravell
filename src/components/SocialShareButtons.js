import React from "react";
import { withRouter } from "next/router";
import { PRODUCTION_WEBSITE_URL } from "./../constants/constants";

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditIcon,
  RedditShareButton,
  TumblrIcon,
  TumblrShareButton,
  LinkedinIcon,
  LinkedinShareButton
} from "react-share";

export const SocialShareButtons = ({ router }) => {
  const url = `${PRODUCTION_WEBSITE_URL}${router.asPath}`;
  const iconProps = {
    round: true,
    size: 35
  };
  const buttonProps = {
    url,
    className: "mr1"
  };
  const buttons = [
    {
      ButtonComponent: FacebookShareButton,
      Icon: FacebookIcon
    },
    {
      ButtonComponent: TwitterShareButton,
      Icon: TwitterIcon
    },
    {
      ButtonComponent: WhatsappShareButton,
      Icon: WhatsappIcon
    },
    {
      ButtonComponent: RedditShareButton,
      Icon: RedditIcon
    },
    {
      ButtonComponent: TumblrShareButton,
      Icon: TumblrIcon
    },
    {
      ButtonComponent: LinkedinShareButton,
      Icon: LinkedinIcon
    }
  ];
  return (
    <div className="flex">
      {buttons.map(({ ButtonComponent, Icon }, index) => (
        <ButtonComponent key={index} {...buttonProps}>
          <Icon {...iconProps} />
        </ButtonComponent>
      ))}
    </div>
  );
};

export default withRouter(SocialShareButtons);
