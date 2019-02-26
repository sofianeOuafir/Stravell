import { addRegion } from "./../../queries/region";
import places from "./../fixtures/regions";
import database from "./../../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../../lib/utils/snapshot";

describe("addRegion", () => {
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

  describe("the regionCode is present", () => {
    test("should add a region at regions/:regionCode", () => {});
    describe("countryCode is present", () => {
      test("should add country at country-regions/:countryCode/:regionCode", () => {});
    });
    describe("countryCode is not present", () => {
      test("should not add region at country-regions/:countryCode/:regionCode", () => {});
    });
  });

  describe("the placeId is not present", () => {
    test("should not add a place at places/:placeId", () => {});
    test("should not add a place at country-places/:countryCode/:placeId", () => {});
    test("should not add a place at region-places/:regionCode/:placeId", () => {});
    test("should not add a place at user-places/:uid/:placeId", () => {});
  });
});
