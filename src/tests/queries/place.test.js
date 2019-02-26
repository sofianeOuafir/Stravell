import { addPlace } from "./../../queries/place";
import places from "./../fixtures/places";
import database from "./../../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../../lib/utils/snapshot";

describe("addPlace", () => {
  beforeEach(done => {
    let data = {};

    // data[`countries/${franceCountryCode}`] = franceWithoutCountryCode;
    // data[
    //   `user-countries/${uid}/${franceCountryCode}`
    // ] = franceWithoutCountryCode;

    database
      .ref()
      .update(data)
      .then(() => done());
  });

  afterEach(done => {
    database
      .ref()
      .set({})
      .then(() => {
        done();
      });
  });

  describe("the placeId is present", () => {
    test("should add a place at places/:placeId", () => {});
    describe("countryCode is present", () => {
      test("should add place at country-places/:countryCode/:placeId", () => {});
    });
    describe("countryCode is not present", () => {
      test("should not add place at country-places/:countryCode/:placeId", () => {});
    });
    describe("regionCode is present", () => {
      test("should add place at region-places/:regionCode/:placeId", () => {});
    });
    describe("regionCode is not present", () => {
      test("should not add place at region-places/:regionCode/:placeId", () => {});
    });
    describe("uid is present", () => {
      test("should add place at user-places/:uid/:placeId", () => {});
    });
    describe("uid is not present", () => {
      test("should not add place at user-places/:uid/:placeId", () => {});
    });
  });

  describe("the placeId is not present", () => {
    test("should not add a place at places/:placeId", () => {});
    test("should not add a place at country-places/:countryCode/:placeId", () => {});
    test("should not add a place at region-places/:regionCode/:placeId", () => {});
    test("should not add a place at user-places/:uid/:placeId", () => {});
  });
});
