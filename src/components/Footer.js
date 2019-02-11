import React from "react";
import Link from "next/link";
import { APP_NAME } from "./../constants/constants";
import {
  IoIosMail,
  IoLogoTwitter,
  IoLogoInstagram,
  IoLogoFacebook,
  IoMdAirplane
} from "react-icons/io";

const Footer = props => (
  <div className="footer">
    <div className="fullwidth content-container align-items--center flex justify-content--between">
      <Link href="/">
        <a className="footer__corporation favourite-font-weight no-text-decoration">
          {APP_NAME}, Inc.
        </a>
      </Link>
      <div className="flex align-items--center">
        <Link href="/destinations">
          <a>
            <IoMdAirplane className="footer__logo" />
          </a>
        </Link>
        <Link href="mailto:stravell.com@gmail.com">
          <a>
            <IoIosMail className="footer__logo" />
          </a>
        </Link>
        <Link href="https://twitter.com/StravellC">
          <a target="_blank">
            <IoLogoTwitter className="footer__logo" />
          </a>
        </Link>
        <Link href="https://www.instagram.com/stravell.blog/">
          <a target="_blank">
            <IoLogoInstagram className="footer__logo" />
          </a>
        </Link>
        <Link href="https://www.facebook.com/Stravellcom-1434113966719446/">
          <a target="_blank">
            <IoLogoFacebook className="footer__logo" />
          </a>
        </Link>
      </div>
    </div>
  </div>
);

export default Footer;
