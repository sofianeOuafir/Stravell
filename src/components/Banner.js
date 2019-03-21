import React from "react";
import { IoIosSearch, IoIosAirplane } from "react-icons/io";
import Typed from "react-typed";
import { Link as ScrollLink } from "react-scroll";

import SocialShareButtons from "./SocialShareButtons";
import Image from './Image';
class Banner extends React.Component {
  render() {
    const { imageUrl, place, placeSuggestions } = this.props;
    return (
      <div className="banner__image-container">
        <div className="content-container">
          <div className="banner__text-container" />
          <div className="banner__text">
            <h1 className="banner__website-name">
              Stravell {place ? `| ${place}` : ""}
            </h1>
            <span className="banner__description">
              A search engine for travel articles. <br /> It makes it easy for you
              to find travel articles about thousands of places
              <br />
              around the world written by some of the best travel bloggers
              worldwide.
            </span>

          </div>
          <div className="banner__typing-container" />
          <div className="banner__typing flex align-items--center">
            <IoIosSearch className="mr1" />
            <Typed
              strings={placeSuggestions}
              typeSpeed={100}
              backSpeed={100}
              loop
            />
          </div>
          <div className="banner__get_started-container">
            <ScrollLink
              href="#"
              className="button button--large button--warm-peach"
              to="searchBarInput"
              smooth="true"
              duration={600}
              offset={-100}
            >
              <div className="flex align-items--center">
                <IoIosAirplane className="mr1" /> <span>Get Started</span>
              </div>
            </ScrollLink>
          </div>

          <div className="banner__social_buttons">
            <SocialShareButtons />
          </div>
        </div>
        <Image className="fullwidth" src={imageUrl} alt="" loadingImageWidth={1026} loadingImageHeight={405} />
      </div>
    );
  }
}

export default Banner;
