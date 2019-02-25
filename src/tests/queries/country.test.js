import { addCountry } from "./../../queries/country";
import countries from "./../fixtures/countries";
import users from "./../fixtures/users";
import database from "./../../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../../lib/utils/snapshot";

describe("addCountry", () => {
  let franceCountryCode;
  let france;
  let franceWithoutCountryCode;
  let uid;
  let user;
  let brazilCountryCode;
  let brazil;
  let brazilWithoutCountryCode;

  beforeEach(done => {
    france = countries[0];
    brazil = countries[1];
    user = users[0];
    ({ countryCode: franceCountryCode, ...franceWithoutCountryCode } = france);
    ({ countryCode: brazilCountryCode, ...brazilWithoutCountryCode } = brazil);
    ({ uid } = user);
    let data = {};

    data[`countries/${franceCountryCode}`] = franceWithoutCountryCode;
    data[
      `user-countries/${uid}/${franceCountryCode}`
    ] = franceWithoutCountryCode;

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
    beforeEach(() => {
      expect(franceCountryCode).toBeDefined();
      expect(franceCountryCode).not.toBeNull();
    });
    describe("the country is already persisted at countries/:countryCode", () => {
      beforeEach(done => {
        database
          .ref(`countries/${franceCountryCode}`)
          .once("value")
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toMatchObject(franceWithoutCountryCode);
            done();
          });
      });
      test("should update the persisted country if the country is beeing updated at countries/:countryCode", done => {
        franceWithoutCountryCode.country = "Brazil";
        addCountry({
          countryData: {
            countryCode: france.countryCode,
            ...franceWithoutCountryCode
          }
        }).then(() => {
          database
            .ref(`countries/${franceCountryCode}`)
            .once("value")
            .then(snapshot => {
              let result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject(franceWithoutCountryCode);
              done();
            });
        });
      });
      test("should not update the persisted country if the country is not beeing updated at countries/:countryCode", done => {
        addCountry({
          countryData: france
        }).then(() => {
          database
            .ref(`countries/${franceCountryCode}`)
            .once("value")
            .then(snapshot => {
              let result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject(franceWithoutCountryCode);
              done();
            });
        });
      });
      test("should not add a new country at countries/:countryCode", done => {
        franceWithoutCountryCode.country = "Brazil";
        addCountry({
          countryData: {
            countryCode: france.countryCode,
            ...franceWithoutCountryCode
          }
        }).then(() => {
          database
            .ref(`countries`)
            .once("value")
            .then(snapshot => {
              let result = fromSnapShotToArray(snapshot);
              expect(result.length).toEqual(1);
              done();
            });
        });
      });
    });
    describe("the country is not persisted yet at countries/:countryCode", () => {
      beforeEach(done => {
        database
          .ref(`countries/${brazilCountryCode}`)
          .once("value")
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toEqual(null);
            done();
          });
      });
      test("should add the country at countries/:countryCode", done => {
        addCountry({ countryData: brazil }).then(() => {
          database
            .ref(`countries/${brazilCountryCode}`)
            .once("value")
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject(brazilWithoutCountryCode);
              return database.ref("countries").once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToArray(snapshot);
              expect(result.length).toEqual(2);
              done();
            });
        });
      });
    });
    describe("the userId is not null", () => {
      beforeEach(() => {
        expect(uid).not.toBeNull();
        expect(uid).toBeDefined();
      });
      describe("the country is already persisted at user-countries/:userId/:countryCode", () => {
        beforeEach(done => {
          database
            .ref(`user-countries/${uid}/${franceCountryCode}`)
            .once("value")
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject(franceWithoutCountryCode);
              done();
            });
        });
        test("should update the persisted country if the country is beeing updated at user-countries/:userId/:countryCode", done => {
          franceWithoutCountryCode.country = "Brazil";
          addCountry({
            countryData: {
              countryCode: france.countryCode,
              ...franceWithoutCountryCode
            },
            userData: {
              uid
            }
          }).then(() => {
            database
              .ref(`user-countries/${uid}/${franceCountryCode}`)
              .once("value")
              .then(snapshot => {
                let result = fromSnapShotToObject(snapshot);
                expect(result).toMatchObject(franceWithoutCountryCode);
                done();
              });
          });
        });
        test("should not update the persisted country if the country is not beeing updated at user-countries/:userId/:countryCode", done => {
          addCountry({
            countryData: {
              countryCode: france.countryCode,
              ...franceWithoutCountryCode
            },
            userData: {
              uid
            }
          }).then(() => {
            database
              .ref(`user-countries/${uid}/${franceCountryCode}`)
              .once("value")
              .then(snapshot => {
                let result = fromSnapShotToObject(snapshot);
                expect(result).toMatchObject(franceWithoutCountryCode);
                done();
              });
          });
        });
        test("should not add a new country at user-countries/:userId/:countryCode", done => {
          franceWithoutCountryCode.country = "Brazil";
          addCountry({
            countryData: {
              countryCode: france.countryCode,
              ...franceWithoutCountryCode
            },
            userData: {
              uid
            }
          }).then(() => {
            database
              .ref(`user-countries/${uid}`)
              .once("value")
              .then(snapshot => {
                let result = fromSnapShotToArray(snapshot);
                expect(result.length).toEqual(1);
                done();
              });
          });
        });
      });

      describe("the country is not persisted yet at user-countries/:userId/:countryCode", () => {
        beforeEach(done => {
          database
            .ref(`user-countries/${uid}/${brazilCountryCode}`)
            .once("value")
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            });
        });
        test("should add the country at user-countries/:userId/:countryCode", done => {
          addCountry({ countryData: brazil, userData: { uid } }).then(() => {
            database
              .ref(`user-countries/${uid}/${brazilCountryCode}`)
              .once("value")
              .then(snapshot => {
                const result = fromSnapShotToObject(snapshot);
                expect(result).toMatchObject(brazilWithoutCountryCode);
                return database.ref(`user-countries/${uid}`).once("value");
              })
              .then(snapshot => {
                const result = fromSnapShotToArray(snapshot);
                expect(result.length).toEqual(2);
                done();
              });
          });
        });
      });
    });

    describe("the userId is null", () => {
      test("should not add the country at user-countries/:userId/:countryCode", done => {
        addCountry({ countryData: brazil, userData: { uid: null } }).then(
          () => {
            database
              .ref(`user-countries/${uid}/${brazilCountryCode}`)
              .once("value")
              .then(snapshot => {
                const result = fromSnapShotToObject(snapshot);
                expect(result).toEqual(null);
                return database.ref(`user-countries/${uid}`).once("value");
              })
              .then(snapshot => {
                const result = fromSnapShotToArray(snapshot);
                expect(result.length).toEqual(1);
                done();
              });
          }
        );
      });
    });
  });

  describe("the countryCode is null", () => {
    test("should not add country at countries/:countryCode", (done) => {
      addCountry({
        countryData: { countryCode: null, ...brazilWithoutCountryCode },
        userData: { uid }
      }).then(() => {
        database
          .ref(`countries/${brazilCountryCode}`)
          .once("value")
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toEqual(null);
            return database.ref(`countries`).once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToArray(snapshot);
            expect(result.length).toEqual(1);
            done();
          });
      });
    });
    test("should not add the country at user-countries/:userId/:countryCode", (done) => {
      addCountry({
        countryData: { countryCode: null, ...brazilWithoutCountryCode },
        userData: { uid }
      }).then(() => {
        database
          .ref(`user-countries/${uid}/${brazilCountryCode}`)
          .once("value")
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toEqual(null);
            return database.ref(`user-countries/${uid}`).once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToArray(snapshot);
            expect(result.length).toEqual(1);
            done();
          });
      });
    });
  });
});
