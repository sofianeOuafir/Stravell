import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon
} from "react-share";

const SocialShareButtons = () => (
  <div>
    <FacebookShareButton url="https://stravell.com">
      <FacebookIcon />
    </FacebookShareButton>
    <TwitterShareButton url="https://stravell.com">
      <TwitterIcon />
    </TwitterShareButton>
  </div>
);

export default SocialShareButtons;
