import React, { Fragment } from "react";

class Image extends React.Component {
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
    const { src, alt, loadingImageWidth, loadingImageHeight, className } = this.props;
    return (
      <Fragment>
        {this.state.startLoadingImage && (
          <img
            src={src}
            onLoad={this.onImageLoad}
            alt={alt}
            className={`${className} ${!this.state.imageloaded ? "hide" : ""}`}
          />
        )}
        {this.state.imageloaded ? null : (
          <div
            style={{
              background: "#364051",
              width: "100%",
              height: "0",
              paddingTop: `${(loadingImageHeight / loadingImageWidth) * 100}%`
            }}
          />
        )}
      </Fragment>
    );
  }
}

export default Image;
