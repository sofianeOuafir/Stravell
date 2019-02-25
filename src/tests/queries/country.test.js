import { addCountry } from "./../../queries/country";
import countries from "./../fixtures/countries";
import users from "./../fixtures/users";
import database from "./../../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../../lib/utils/snapshot";

describe("addCountry", () => {
  beforeEach(done => {
    const { countryCode, ...country } = countries[0];
    const { uid } = users[0];
    let data = {};

    data[`countries/${countryCode}`] = country;
    data[`user-countries/${uid}/${countryCode}`] = country;

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

  describe("the countryCode is not null", () => {
    describe("the country is already persisted at countries/:countryCode", () => {
      test("should only update the persisted country if the country is beeing updated at countries/:countryCode", () => {});
      test("should not update the persisted country if the country is not beeing updated at countries/:countryCode", () => {});
      test("should not add a new country at countries/:countryCode", () => {});
    });
    describe("the country is not persisted yet at countries/:countryCode", () => {
      test("should add the country at countries/:countryCode", () => {});
    });
    describe("the userId is not null", () => {
      describe("the country is already persisted at user-countries/:userId/:countryCode", () => {
        test("should only update the persisted country if the country is beeing updated at user-countries/:userId/:countryCode", () => {});
        test("should not update the persisted country if the country is not beeing updated at user-countries/:userId/:countryCode", () => {});
        test("should not add a new country at user-countries/:userId/:countryCode", () => {});
      });

      describe("the country is not persisted yet at user-countries/:userId/:countryCode", () => {
        test("should add the country at user-countries/:userId/:countryCode", () => {});
      });
    });

    describe("the userId is null", () => {
      test("should not add the country at user-countries/:userId/:countryCode", () => {});
    });
  });

  describe("the countryCode is null", () => {
    test("should not add country at countries/:countryCode", () => {});
    test("should not add the country at user-countries/:userId/:countryCode", () => {});
  });
});
