import React from "react";
import moment from "moment";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { FaCheck, FaTimes } from "react-icons/fa";
import uuid from "uuid";
import { connect } from "react-redux";

import MyEditor from "./MyEditor";
import { uploadFile } from "./../aws/s3";
import Loading from "./Loading";
import SearchLocationInput from "./SearchLocationInput";
import { getLocationData } from "./../places/places";

import {
  formatTitle,
  formatDescription,
  getTitleError,
  getDescriptionError,
  getImageError,
  getBodyError,
  getProvidedURLError
} from "./../lib/utils/post";
import Checkbox from "./Checkbox";

class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: (props.post && props.post.title) || "",
      description: (props.post && props.post.description) || "",
      image: (props.post && props.post.image) || "",
      body:
        (props.post &&
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(props.post.body))
          )) ||
        EditorState.createEmpty(),
      address: (props.post && props.post.address) || "",
      lat: (props.post && props.post.lat) || "",
      lng: (props.post && props.post.lng) || "",
      region: (props.post && props.post.region) || "",
      regionCode: (props.post && props.post.regionCode) || "",
      country: (props.post && props.post.country) || "",
      countryCode: (props.post && props.post.countryCode) || "",
      createdAt: (props.post && moment(props.post.createdAt)) || moment(),
      s3FolderName: (props.post && props.post.s3FolderName) || uuid(),
      updatedAt: moment(),
      providedURL: (props.post && props.post.providedURL) || "",
      provideURL: (props.post && props.post.provideURL) || false,
      titleError: "",
      descriptionError: "",
      imageError: "",
      bodyError: "",
      providedURLError: "",
      imageUploading: false,
      submitting: false
    };
  }

  onAddressChange = address => {
    this.setState(() => ({ address }));
  };

  onAddressSelect = address => {
    this.setState(() => ({ address }));
  };

  onDescriptionChange = e => {
    const description = e.target.value;
    this.setState(() => ({
      description,
      descriptionError: getDescriptionError(description)
    }));
  };

  onTitleChange = e => {
    const title = e.target.value;
    this.setState(() => ({ title: title, titleError: getTitleError(title) }));
  };

  onImageChange = e => {
    const file = new File([e.target.files[0]], `main`, {
      type: e.target.files[0].type
    });
    const formatAccepted = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/svg"
    ];
    if (!formatAccepted.includes(file.type)) {
      this.setState(() => ({
        imageError: "The format of the uploaded image is not accepted."
      }));
      return;
    }
    this.setState(
      () => ({ imageUploading: true }),
      () => {
        uploadFile({ file, location: `pictures/${this.state.s3FolderName}` })
          .then(({ Location }) => {
            this.setState(() => ({
              image: Location,
              imageError: getImageError(Location),
              imageUploading: false
            }));
          })
          .catch(err => {
            this.setState(() => ({ imageUploading: false, imageError: err }));
          });
      }
    );
  };

  onBodyChange = editorState => {
    const body = editorState.getCurrentContent().getPlainText();
    this.setState(() => ({ body: editorState, bodyError: getBodyError(body) }));
  };

  onProvidedURLChange = e => {
    const providedURL = e.target.value;
    this.setState(() => ({
      providedURL,
      providedURLError: getProvidedURLError(providedURL)
    }));
  };

  onProvideURLChange = provideURL => {
    this.setState(() => ({ provideURL }));
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState(
      () => ({ submitting: true }),
      async () => {
        let errors = {
          title: getTitleError(this.state.title),
          description: getDescriptionError(this.state.description),
          image: getImageError(this.state.image),
          body: getBodyError(
            this.state.body.getCurrentContent().getPlainText()
          ),
          providedURL: getProvidedURLError(this.state.providedURL)
        };
        if (
          errors.title === "" &&
          errors.description === "" &&
          errors.image === "" &&
          (this.state.provideURL || errors.body === "") &&
          (!this.state.provideURL || errors.providedURL === "")
        ) {
          const address = this.state.address;
          const locationData = await getLocationData(address);
          const { countryData, regionData, placeData } = locationData;
          const {
            name: countryName,
            code: countryCode,
            bounds: {
              northEastLat: countryNorthEastLat,
              northEastLng: countryNorthEastLng,
              southWestLat: countrySouthWestLat,
              southWestLng: countrySouthWestLng
            }
          } = countryData;
          const {
            name: regionName,
            code: regionCode,
            bounds: {
              northEastLat: regionNorthEastLat,
              northEastLng: regionNorthEastLng,
              southWestLat: regionSouthWestLat,
              southWestLng: regionSouthWestLng
            }
          } = regionData;
          const {
            placeId,
            lat,
            lng,
            bounds: {
              northEastLat: placeNorthEastLat,
              northEastLng: placeNorthEastLng,
              southWestLat: placeSouthWestLat,
              southWestLng: placeSouthWestLng
            }
          } = placeData;
          const {
            uid = null,
            userName = null,
            userPhotoURL = null
          } = this.props;

          const country = {
            countryCode,
            country: countryName,
            countryNorthEastLat,
            countryNorthEastLng,
            countrySouthWestLat,
            countrySouthWestLng
          };

          const region = {
            regionCode,
            region: regionName,
            regionNorthEastLat,
            regionNorthEastLng,
            regionSouthWestLat,
            regionSouthWestLng,
            countryCode,
            country: countryName
          };

          const place = {
            placeId,
            address,
            lat,
            lng,
            placeNorthEastLat,
            placeNorthEastLng,
            placeSouthWestLat,
            placeSouthWestLng,
            countryCode,
            country: countryName,
            region: regionName,
            regionCode
          };

          const user = {
            uid,
            userName,
            userPhotoURL
          };

          const post = {
            title: formatTitle(this.state.title),
            description: formatDescription(this.state.description),
            image: this.state.image,
            body: JSON.stringify(
              convertToRaw(this.state.body.getCurrentContent())
            ),
            createdAt: this.state.createdAt.valueOf(),
            updatedAt: this.state.updatedAt.valueOf(),
            s3FolderName: this.state.s3FolderName,
            providedURL: this.state.providedURL,
            provideURL: this.state.provideURL,
            country: countryName,
            countryCode,
            region: regionName,
            regionCode: regionCode,
            address,
            lat,
            lng,
            uid,
            userName,
            userPhotoURL,
            placeId
          };

          this.props.onSubmit({
            post,
            country,
            user,
            place,
            region
          });
        } else {
          this.setState(() => ({
            submitting: false,
            titleError: errors.title,
            descriptionError: errors.description,
            imageError: errors.image,
            bodyError: errors.body,
            providedURLError: errors.providedURL
          }));
        }
      }
    );
  };

  getValidationIcon = error => {
    if (error) {
      return <FaTimes className={`icon c-warm-peach`} />;
    } else {
      return <FaCheck className={`icon c-limegreen`} />;
    }
  };

  render() {
    return (
      <form id="form" className="form mb3 pb3" onSubmit={this.onSubmit}>
        <div className="form__input-container">
          {this.getValidationIcon(this.state.titleError)}
          <input
            id="titleInput"
            placeholder="Write a title here"
            className="text-input"
            type="text"
            onChange={this.onTitleChange}
            autoFocus
            value={this.state.title}
          />
          {this.state.titleError && (
            <p className="error">{this.state.titleError}</p>
          )}
        </div>
        <div className="form__input-container">
          {this.getValidationIcon(this.state.descriptionError)}
          <input
            id="descriptionInput"
            placeholder="Write a small description here"
            className="text-input"
            type="text"
            onChange={this.onDescriptionChange}
            value={this.state.description}
          />
          {this.state.descriptionError && (
            <p className="error">{this.state.descriptionError}</p>
          )}
        </div>
        <div className="form__input-container">
          <SearchLocationInput
            value={this.state.address}
            handleChange={this.onAddressChange}
            onSelect={this.onAddressSelect}
          />
        </div>
        <div className="form__input-container">
          {this.getValidationIcon(this.state.imageError)}
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={this.onImageChange}
            className="text-input"
          />
          {this.state.imageError && (
            <p className="error">{this.state.imageError}</p>
          )}
          <div className="quarterwidth flex align-items--center justify-content--center mt2">
            {this.state.imageUploading ? (
              <Loading size="small" />
            ) : (
              this.state.image && (
                <img
                  src={`${this.state.image}`}
                  alt={`${this.state.image}`}
                  className="fullwidth"
                />
              )
            )}
          </div>
        </div>
        <div>
          <p>What do you want to do today?</p>
          <Checkbox
            id="provideURLFalse"
            onChange={() => {
              this.onProvideURLChange(false);
            }}
            checked={!this.state.provideURL}
            label="I want to write the content of the post."
          />
          <Checkbox
            id="provideURLTrue"
            onChange={() => {
              this.onProvideURLChange(true);
            }}
            checked={this.state.provideURL}
            label="I want to provide an URL for this post (users will be redirected
                            to the provided URL). "
          />
        </div>
        {this.state.provideURL && (
          <div className="form__input-container">
            {this.getValidationIcon(this.state.providedURLError)}
            <input
              id="providedURLInput"
              placeholder="Provide an URL here"
              className="text-input"
              type="text"
              onChange={this.onProvidedURLChange}
              value={this.state.providedURL}
            />
            {this.state.providedURLError && (
              <p className="error">{this.state.providedURLError}</p>
            )}
          </div>
        )}

        {!this.state.provideURL && (
          <div className="form__input-container">
            {this.state.bodyError && (
              <p className="error">{this.state.bodyError}</p>
            )}
            <MyEditor
              id="editor"
              placeholder="Write your article here"
              editorState={this.state.body}
              onChange={this.onBodyChange}
              s3FolderName={this.state.s3FolderName}
            />
          </div>
        )}

        <div>
          <button disabled={this.state.submitting} className="button">
            {this.state.submitting ? (
              <span>...Saving Post</span>
            ) : (
              <span> Save Post</span>
            )}
          </button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  uid: auth.uid,
  userName: auth.userName,
  userPhotoURL: auth.userPhotoURL
});

export { PostForm };
export default connect(mapStateToProps)(PostForm);
