import React from "react";
import { IoIosSearch, IoIosAirplane } from "react-icons/io";
import Typed from "react-typed";
import { Link as ScrollLink } from "react-scroll";

import SocialShareButtons from "./SocialShareButtons";

class LandingPageBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      startLoadingImage: false
    };
  }
  componentDidMount() {
    this.setState(() => ({ startLoadingImage: true }));
  }
  onImageLoad = () => {
    this.setState(() => ({ imageloaded: true }));
  };
  render() {
    const { imageUrl, place, placeSuggestions } = this.props;
    return (
      <div className="homepage__image-container">
        <div className="content-container">
          <div className="homepage__image-container__text-container" />
          <div className="homepage__image-container__text">
            <h1 className="homepage__image-container__text--website-name">
              Stravell {place ? `| ${place}` : ""}
            </h1>
            A search engine for travel articles. <br /> It makes it easy for you
            to find travel articles about thousands of places
            <br />
            around the world written by some of the best travel bloggers
            worldwide.
          </div>
          <div className="homepage__image-container__typing-container" />
          <div className="homepage__image-container__typing flex align-items--center">
            <IoIosSearch className="mr1" />
            <Typed
              strings={placeSuggestions}
              typeSpeed={100}
              backSpeed={100}
              loop
            />
          </div>
          <div className="absolute homepage__image-container__get_started-container">
            <ScrollLink
              href="#"
              className="button button--large button--warm-peach"
              to="searchBarContainer"
              smooth="true"
              duration={600}
              offset={-28}
            >
              <div className="flex align-items--center">
                <IoIosAirplane className="mr1" /> <span>Get Started</span>
              </div>
            </ScrollLink>
          </div>

          <div className="homepage__image-container__social_buttons">
            <SocialShareButtons />
          </div>
        </div>
        {this.state.startLoadingImage && (
          <img
            src={imageUrl}
            onLoad={this.onImageLoad}
            alt=""
            className={`fullwidth ${!this.state.imageloaded ? "hide" : ""}`}
          />
        )}

        {this.state.imageloaded ? null : <div className="test" />}
      </div>
    );
  }
}

export default LandingPageBanner;
