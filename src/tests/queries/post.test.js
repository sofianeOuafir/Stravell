import { addPost, editPost } from "./../../queries/post";
import posts from "./../fixtures/posts";
import users from "./../fixtures/users";
import places from "./../fixtures/places";
import regions from "./../fixtures/regions";
import countries from "./../fixtures/countries";
import database from "./../../firebase/firebase";
import {
  generateTooShortString,
  generateTooLongString
} from "./../helpers/helpers";
import {
  MIN_NUM_OF_CHARACTERS_FOR_TITLE,
  MAX_NUM_OF_CHARACTERS_FOR_TITLE,
  MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION,
  MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION
} from "./../../constants/constants";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../../lib/utils/snapshot";

const france = countries[0];
const brazil = countries[1];
const newSouthWales = regions[1];
const paca = regions[0];

describe("editPost", () => {
  let post = posts[0];
  let postBeforeUpdate = {
    ...post
  };

  beforeEach(done => {
    let updateObject = {};
    updateObject[`/posts/${postBeforeUpdate.id}`] = postBeforeUpdate;
    updateObject[
      `/user-posts/${postBeforeUpdate.uid}/${post.id}`
    ] = postBeforeUpdate;
    updateObject[
      `/region-posts/${postBeforeUpdate.regionCode}/${post.id}`
    ] = postBeforeUpdate;
    updateObject[
      `/country-posts/${postBeforeUpdate.countryCode}/${postBeforeUpdate.id}`
    ] = postBeforeUpdate;
    updateObject[
      `/user-countries/${postBeforeUpdate.uid}/${postBeforeUpdate.countryCode}`
    ] = france;
    database
      .ref()
      .update(updateObject)
      .then(() => {
        done();
      });
  });

  afterEach(done => {
    database
      .ref()
      .set({})
      .then(() => {
        done();
      });
  });

  test("should edit post at /post/:id", done => {
    database
      .ref(`posts/${post.id}`)
      .once("value")
      .then(snapshot => {
        const post = fromSnapShotToObject(snapshot);
        expect(post.address).toEqual("Cannes");
      })
      .then(() => {
        post.address = "Briançon";
        return editPost({
          postBeforeUpdate,
          post
        });
      })
      .then(() => {
        return database
          .ref(`posts/${post.id}`)
          .once("value")
          .then(snapshot => {
            const post = fromSnapShotToObject(snapshot);
            expect(post.address).toEqual("Briançon");
            done();
          });
      });
  });

  test("should edit post at /user-posts/:uid/:id", done => {
    database
      .ref(`user-posts/${post.uid}/${post.id}`)
      .once("value")
      .then(snapshot => {
        const post = fromSnapShotToObject(snapshot);
        expect(post.address).toEqual("Cannes");
      })
      .then(() => {
        post.address = "Briançon";
        return editPost({
          postBeforeUpdate,
          post
        });
      })
      .then(() => {
        return database
          .ref(`user-posts/${post.uid}/${post.id}`)
          .once("value")
          .then(snapshot => {
            const post = fromSnapShotToObject(snapshot);
            expect(post.address).toEqual("Briançon");
            done();
          });
      });
  });

  describe("countryCode", () => {
    describe("was not null before update", () => {
      beforeEach(() => {
        expect(postBeforeUpdate.countryCode).toBeTruthy();
      });
      describe("has not changed", () => {
        beforeEach(() => {
          expect(postBeforeUpdate.countryCode).toEqual("FR");
        });
        test("should edit post at /country-posts/:countryCode/:id", done => {
          database
            .ref(`country-posts/FR/${post.id}`)
            .once("value")
            .then(snapshot => {
              const post = fromSnapShotToObject(snapshot);
              expect(post.address).toEqual("Cannes");
            })
            .then(() => {
              post.address = "Briançon";
              return editPost({
                postBeforeUpdate,
                post
              });
            })
            .then(() => {
              return database
                .ref(`country-posts/${post.countryCode}/${post.id}`)
                .once("value")
                .then(snapshot => {
                  const post = fromSnapShotToObject(snapshot);
                  expect(post.address).toEqual("Briançon");
                  done();
                });
            });
        });
      });
      describe("has changed", () => {
        describe("and is not null", () => {
          beforeEach(() => {
            post.countryCode = "BR";
            expect(post.countryCode).not.toEqual("FR");
            expect(post).toBeTruthy();
          });
          test("should add post at /country-posts/:newCountryCode/:id", done => {
            return database
              .ref(`/country-posts/BR/${post.id}`)
              .once("value")
              .then(snapshot => {
                const post = fromSnapShotToObject(snapshot);
                expect(post).toBeNull();
              })
              .then(() => {
                return editPost({
                  postBeforeUpdate,
                  post
                });
              })
              .then(() => {
                database
                  .ref(`/country-posts/BR/${post.id}`)
                  .once("value")
                  .then(snapshot => {
                    const post = fromSnapShotToObject(snapshot);
                    expect(post.countryCode).toEqual("BR");
                    done();
                  });
              });
          });
          test("should remove post at /country-posts/:formerCountryCode/:id", done => {
            return database
              .ref(`/country-posts/FR/${post.id}`)
              .once("value")
              .then(snapshot => {
                const post = fromSnapShotToObject(snapshot);
                expect(post).toBeTruthy();
                expect(post.countryCode).toEqual("FR");
              })
              .then(() => {
                return editPost({
                  postBeforeUpdate,
                  post
                });
              })
              .then(() => {
                database
                  .ref(`/country-posts/FR/${post.id}`)
                  .once("value")
                  .then(snapshot => {
                    const post = fromSnapShotToObject(snapshot);
                    expect(post).toBeNull();
                    done();
                  });
              });
          });
          test("should add new country at countries/:newCountryCode", done => {
            database
              .ref("countries/BR")
              .once("value")
              .then(snapshot => {
                const country = fromSnapShotToObject(snapshot);
                expect(country).toBeNull();
              })
              .then(() => {
                return editPost({
                  postBeforeUpdate,
                  post,
                  country: brazil
                });
              })
              .then(() => {
                database
                  .ref("countries/BR")
                  .once("value")
                  .then(snapshot => {
                    const country = fromSnapShotToObject(snapshot);
                    expect(country).toBeTruthy();
                    expect(country.countryCode).toEqual("BR");
                    done();
                  });
              });
          });

          test("should add the new country at user-countries/:uid/:newCountryCode", done => {
            database
              .ref(`user-countries/${post.uid}/BR`)
              .once("value")
              .then(snapshot => {
                const country = fromSnapShotToArray(snapshot);
                expect(country.length).toEqual(0);
              })
              .then(() => {
                return editPost({
                  postBeforeUpdate,
                  post,
                  country: brazil
                });
              })
              .then(snapshot => {
                return database
                  .ref(`user-countries/${post.uid}/BR`)
                  .once("value");
              })
              .then(snapshot => {
                const country = fromSnapShotToObject(snapshot);
                expect(country).toBeTruthy();
                expect(country.countryCode).toEqual("BR");
                done();
              });
          });
          test("should remove the former country at user-countries/:uid/:formerCountry if not another article belonging to that same user talk about the former country", done => {
            database
              .ref(`user-countries/${post.uid}/FR`)
              .once("value")
              .then(snapshot => {
                const country = fromSnapShotToObject(snapshot);
                expect(country).toBeTruthy();
                expect(country.countryCode).toEqual("FR");
              })
              .then(() => {
                database
                  .ref(`user-posts/${post.uid}`)
                  .orderByChild("countryCode")
                  .equalTo("FR")
                  .once("value")
                  .then(snapshot => {
                    // proof that there is only one post talking about that former country
                    const post = fromSnapShotToObject(snapshot);
                    expect(post).toBeTruthy();
                  });
              })
              .then(() => {
                return editPost({
                  postBeforeUpdate,
                  post,
                  country: brazil
                });
              })
              .then(snapshot => {
                return database
                  .ref(`user-countries/${post.uid}/FR`)
                  .once("value");
              })
              .then(snapshot => {
                const country = fromSnapShotToObject(snapshot);
                expect(country).toBeNull();
                done();
              });
          });
          test("should not remove the former country at user-countries/:uid/:formerCountry if another article belonging to that same user talk about the former country", done => {
            database
              .ref(`user-posts/${post.uid}/abc123`)
              .update(postBeforeUpdate)
              .then(() => {
                database
                  .ref(`user-countries/${post.uid}/FR`)
                  .once("value")
                  .then(snapshot => {
                    const country = fromSnapShotToObject(snapshot);
                    expect(country).toBeTruthy();
                    expect(country.countryCode).toEqual("FR");
                  })
                  .then(() => {
                    database
                      .ref(`user-posts/${post.uid}`)
                      .orderByChild("countryCode")
                      .equalTo("FR")
                      .once("value")
                      .then(snapshot => {
                        const posts = fromSnapShotToArray(snapshot);
                        expect(posts.length).toEqual(2);
                      });
                  })
                  .then(() => {
                    return editPost({
                      postBeforeUpdate,
                      post,
                      country: brazil
                    });
                  })
                  .then(snapshot => {
                    return database
                      .ref(`user-countries/${post.uid}/FR`)
                      .once("value");
                  })
                  .then(snapshot => {
                    const country = fromSnapShotToObject(snapshot);
                    expect(country).toBeTruthy();
                    done();
                  });
              });
          });
        });
        describe("and is null", () => {
          beforeEach(() => {
            post.countryCode = null;
            expect(post.countryCode).not.toEqual("FR");
            expect(post.countryCode).toBeNull();
          });
          test("should not add new country at countries/:newCountryCode", done => {
            database
              .ref(`coutries/${null}`)
              .once("value")
              .then(snapshot => {
                const country = fromSnapShotToObject(snapshot);
                expect(country).toBeNull();
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate,
                  country: brazil
                });
              })
              .then(() => {
                database
                  .ref(`coutries/${null}`)
                  .once("value")
                  .then(snapshot => {
                    const country = fromSnapShotToObject(snapshot);
                    expect(country).toBeNull();
                    done();
                  });
              });
          });
          test("should not add new country at user-countries/:uid/:newCountryCode", done => {
            database
              .ref(`user-coutries/${post.uid}/${null}`)
              .once("value")
              .then(snapshot => {
                const country = fromSnapShotToObject(snapshot);
                expect(country).toBeNull();
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate,
                  country: brazil
                });
              })
              .then(() => {
                database
                  .ref(`user-coutries/${post.uid}/${null}`)
                  .once("value")
                  .then(snapshot => {
                    const country = fromSnapShotToObject(snapshot);
                    expect(country).toBeNull();
                    done();
                  });
              });
          });
          test("should not add post at /country-posts/:newCountryCode/:id", done => {
            database
              .ref(`country-posts/${null}/${post.id}`)
              .once("value")
              .then(snapshot => {
                const post = fromSnapShotToObject(snapshot);
                expect(post).toBeNull();
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate,
                  country: brazil
                });
              })
              .then(() => {
                database
                  .ref(`country-posts/${null}/${post.id}`)
                  .once("value")
                  .then(snapshot => {
                    const post = fromSnapShotToObject(snapshot);
                    expect(post).toBeNull();
                    done();
                  });
              });
          });
          test("should remove the former country at user-countries/:uid/:formerCountryCode if not another article belonging to that same user talk about the former country", done => {
            database
              .ref(`user-countries/${post.uid}/FR`)
              .once("value")
              .then(snapshot => {
                const country = fromSnapShotToObject(snapshot);
                expect(country).toBeTruthy();
                expect(country.countryCode).toEqual("FR");
              })
              .then(() => {
                database
                  .ref(`user-posts/${post.uid}`)
                  .orderByChild("countryCode")
                  .equalTo("FR")
                  .once("value")
                  .then(snapshot => {
                    // proof that there is only one post talking about that former country
                    const post = fromSnapShotToObject(snapshot);
                    expect(post).toBeTruthy();
                  });
              })
              .then(() => {
                return editPost({
                  postBeforeUpdate,
                  post,
                  country: brazil
                });
              })
              .then(snapshot => {
                return database
                  .ref(`user-countries/${post.uid}/FR`)
                  .once("value");
              })
              .then(snapshot => {
                const country = fromSnapShotToObject(snapshot);
                expect(country).toBeNull();
                done();
              });
          });
          test("should not remove the former country at user-countries/:uid/:formerCountryCode if another article belonging to that same user talk about the former country", done => {
            database
              .ref(`user-posts/${post.uid}/abc123`)
              .update(postBeforeUpdate)
              .then(() => {
                database
                  .ref(`user-countries/${post.uid}/FR`)
                  .once("value")
                  .then(snapshot => {
                    const country = fromSnapShotToObject(snapshot);
                    expect(country).toBeTruthy();
                    expect(country.countryCode).toEqual("FR");
                  })
                  .then(() => {
                    database
                      .ref(`user-posts/${post.uid}`)
                      .orderByChild("countryCode")
                      .equalTo("FR")
                      .once("value")
                      .then(snapshot => {
                        const posts = fromSnapShotToArray(snapshot);
                        expect(posts.length).toEqual(2);
                      });
                  })
                  .then(() => {
                    return editPost({
                      postBeforeUpdate,
                      post,
                      country: brazil
                    });
                  })
                  .then(snapshot => {
                    return database
                      .ref(`user-countries/${post.uid}/FR`)
                      .once("value");
                  })
                  .then(snapshot => {
                    const country = fromSnapShotToObject(snapshot);
                    expect(country).toBeTruthy();
                    done();
                  });
              });
          });
          test("should remove the post at /country-posts/:formerCountryCode/:id", done => {
            database
              .ref(`/country-posts/FR/${post.id}`)
              .once("value")
              .then(snapshot => {
                const post = fromSnapShotToObject(snapshot);
                expect(post).toBeTruthy();
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate
                }).then(() => {
                  database
                    .ref(`country-posts/FR`)
                    .once("value")
                    .then(snapshot => {
                      const post = fromSnapShotToObject(snapshot);
                      expect(post).toBeNull();
                      done();
                    });
                });
              });
          });
        });
      });
    });

    describe("was null before update", () => {
      beforeEach(() => {
        postBeforeUpdate.countryCode = null;
        expect(postBeforeUpdate.countryCode).toBeNull();
      });
      describe("countryCode has changed", () => {
        beforeEach(() => {
          post.countryCode = "BR";
          expect(post.countryCode).not.toBeNull();
        });
        test("should add the post at /country-posts/:newCountryCode/:id", done => {
          database
            .ref(`country-posts/BR/${post.id}`)
            .once("value")
            .then(snapshot => {
              const post = fromSnapShotToObject(snapshot);
              expect(post).toBeNull();
            })
            .then(() => {
              return editPost({
                post,
                postBeforeUpdate
              });
            })
            .then(() => {
              database
                .ref(`country-posts/BR/${post.id}`)
                .once("value")
                .then(snapshot => {
                  const post = fromSnapShotToObject(snapshot);
                  expect(post).toBeTruthy();
                  expect(post.id).toEqual(postBeforeUpdate.id);
                  done();
                });
            });
        });
        test("should add the new country at countries/:newCountryCode", done => {
          database
            .ref("countries/BR")
            .once("value")
            .then(snapshot => {
              const country = fromSnapShotToObject(snapshot);
              expect(country).toBeNull();
            })
            .then(() => {
              return editPost({
                post,
                postBeforeUpdate,
                country: brazil
              }).then(() => {
                database
                  .ref("countries/BR")
                  .once("value")
                  .then(snapshot => {
                    const country = fromSnapShotToObject(snapshot);
                    expect(country).toBeTruthy();
                    expect(post.id).toEqual(postBeforeUpdate.id);
                    done();
                  });
              });
            });
        });
        test("should add the new country at user-countries/:uid/:newCountryCode", done => {
          database
            .ref(`user-countries/${post.uid}/BR`)
            .once("value")
            .then(snapshot => {
              const country = fromSnapShotToObject(snapshot);
              expect(country).toBeNull();
            })
            .then(() => {
              return editPost({
                post,
                postBeforeUpdate,
                country: brazil
              });
            })
            .then(() => {
              database
                .ref(`user-countries/${post.uid}/BR`)
                .once("value")
                .then(snapshot => {
                  const country = fromSnapShotToObject(snapshot);
                  expect(country).toBeTruthy();
                  expect(country.countryCode).toEqual("BR");
                  done();
                });
            });
        });
      });
    });
  });
  describe("regionCode", () => {
    describe("was not null before update", () => {
      beforeEach(() => {
        expect(postBeforeUpdate.regionCode).toBeTruthy();
      });
      describe("has not changed", () => {
        beforeEach(() => {
          expect(postBeforeUpdate.regionCode).toEqual(post.regionCode);
        });
        test("should edit post at /region-posts/regionCode/:id", done => {
          database
            .ref(`region-posts/${paca.regionCode}/${post.id}`)
            .once("value")
            .then(snapshot => {
              const post = fromSnapShotToObject(snapshot);
              expect(post).toBeTruthy();
              expect(post.address).toEqual("Cannes");
            })
            .then(() => {
              post.address = "Paris";
              return editPost({
                postBeforeUpdate,
                post
              });
            })
            .then(() => {
              database
                .ref(`region-posts/${paca.regionCode}/${post.id}`)
                .once("value")
                .then(snapshot => {
                  const post = fromSnapShotToObject(snapshot);
                  expect(post).toBeTruthy();
                  expect(post.address).toEqual("Paris");
                  done();
                });
            });
        });
      });
      describe("has changed", () => {
        beforeEach(() => {
          post.regionCode = newSouthWales.regionCode;
          post.countryCode = newSouthWales.countryCode;
          expect(postBeforeUpdate.regionCode).not.toEqual(post.regionCode);
        });
        describe("and is not null", () => {
          beforeEach(() => {
            expect(post.regionCode).toBeTruthy();
          });
          test("should add new region at regions/:newRegionCode", done => {
            database
              .ref(`regions/${post.regionCode}`)
              .once("value")
              .then(snapshot => {
                const region = fromSnapShotToObject(snapshot);
                expect(region).toBeNull();
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate,
                  region: newSouthWales
                });
              })
              .then(() => {
                database
                  .ref(`regions/${post.regionCode}`)
                  .once("value")
                  .then(snapshot => {
                    const region = fromSnapShotToObject(snapshot);
                    expect(region).toBeTruthy();
                    expect(region).toMatchObject(newSouthWales);
                    done();
                  });
              });
          });
          test("should add post at /region-posts/newRegionCode/:id", done => {
            database
              .ref(`region-posts/${post.countryCode}/${post.id}`)
              .once("value")
              .then(snapshot => {
                const post = fromSnapShotToObject(snapshot);
                expect(post).toBeNull();
              })
              .then(() => {
                return editPost({
                  postBeforeUpdate,
                  post
                });
              })
              .then(() => {
                database
                  .ref(`region-posts/${post.regionCode}/${post.id}`)
                  .once("value")
                  .then(snapshot => {
                    const post = fromSnapShotToObject(snapshot);
                    expect(post).toBeTruthy();
                    expect(post.regionCode).toEqual(newSouthWales.regionCode);
                    done();
                  });
              });
          });
          test("should remove post at /region-posts/:formerRegionCode/:id", done => {
            database
              .ref(`region-posts/${postBeforeUpdate.regionCode}/${post.id}`)
              .once("value")
              .then(snapshot => {
                const post = fromSnapShotToObject(snapshot);
                expect(post).toBeTruthy();
                expect(post).toMatchObject(postBeforeUpdate);
              })
              .then(() => {
                return editPost({
                  postBeforeUpdate,
                  post
                });
              })
              .then(() => {
                database
                  .ref(`region-posts/${postBeforeUpdate.regionCode}/${post.id}`)
                  .once("value")
                  .then(snapshot => {
                    const post = fromSnapShotToObject(snapshot);
                    expect(post).toBeNull();
                    done();
                  });
              });
          });

          describe("countryCode is not null", () => {
            beforeEach(() => {
              expect(post.countryCode).toBeTruthy();
            });
            test("should add new region at country-regions/:countryCode/newRegionCode", done => {
              database
                .ref(`/country-regions/${post.countryCode}/${post.regionCode}`)
                .once("value")
                .then(snapshot => {
                  const region = fromSnapShotToObject(snapshot);
                  expect(region).toBeNull();
                })
                .then(() => {
                  return editPost({
                    post,
                    postBeforeUpdate,
                    region: newSouthWales
                  });
                })
                .then(() => {
                  database
                    .ref(
                      `/country-regions/${post.countryCode}/${post.regionCode}`
                    )
                    .once("value")
                    .then(snapshot => {
                      const region = fromSnapShotToObject(snapshot);
                      expect(region).toBeTruthy();
                      expect(region).toMatchObject(newSouthWales);
                      done();
                    });
                });
            });
          });

          describe("countryCode is null", () => {
            beforeEach(() => {
              post.countryCode = null;
              expect(post.countryCode).toBeNull();
            });
            test("should not add new region at country-regions/null/newRegionCode", done => {
              database
                .ref(`/country-regions/${post.countryCode}/${post.regionCode}`)
                .once("value")
                .then(snapshot => {
                  const region = fromSnapShotToObject(snapshot);
                  expect(region).toBeNull();
                })
                .then(() => {
                  return editPost({
                    post,
                    postBeforeUpdate,
                    region: newSouthWales
                  });
                })
                .then(() => {
                  database
                    .ref(
                      `/country-regions/${post.countryCode}/${
                        newSouthWales.regionCode
                      }`
                    )
                    .once("value")
                    .then(snapshot => {
                      const region = fromSnapShotToObject(snapshot);
                      expect(region).toBeNull();
                      done();
                    });
                });
            });
          });
        });
        describe("and is null", () => {
          beforeEach(() => {
            post.regionCode = null;
            expect(post.regionCode).toBeNull();
            expect(post.countryCode).toBeTruthy();
          });
          test("should not add post at /region-posts/newRegionCode/:id", done => {
            database
              .ref(`/region-posts/${post.regionCode}/${post.id}`)
              .once("value")
              .then(snapshot => {
                const post = fromSnapShotToObject(snapshot);
                expect(post).toBeNull();
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate
                });
              })
              .then(() => {
                database
                  .ref(`/region-posts/${post.regionCode}/${post.id}`)
                  .once("value")
                  .then(snapshot => {
                    const post = fromSnapShotToObject(snapshot);
                    expect(post).toBeNull();
                    done();
                  });
              });
          });
          test("should remove post at /region-posts/:formerRegionCode/:id", done => {
            database
              .ref(`/region-posts/${postBeforeUpdate.regionCode}/${post.id}`)
              .once("value")
              .then(snapshot => {
                const post = fromSnapShotToObject(snapshot);
                expect(post).toBeTruthy();
                expect(post).toMatchObject(postBeforeUpdate);
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate
                });
              })
              .then(() => {
                database
                  .ref(
                    `/region-posts/${postBeforeUpdate.regionCode}/${post.id}`
                  )
                  .once("value")
                  .then(snapshot => {
                    const post = fromSnapShotToObject(snapshot);
                    expect(post).toBeNull();
                    done();
                  });
              });
          });
          test("should not add new region at country-regions/:countryCode/newRegionCode", done => {
            database
              .ref(`/country-regions/${post.countryCode}/${post.regionCode}`)
              .once("value")
              .then(snapshot => {
                const region = fromSnapShotToObject(snapshot);
                expect(region).toBeNull();
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate,
                  region: newSouthWales
                });
              })
              .then(() => {
                database
                  .ref(
                    `/country-regions/${post.countryCode}/${post.regionCode}`
                  )
                  .once("value")
                  .then(snapshot => {
                    const region = fromSnapShotToObject(snapshot);
                    expect(region).toBeNull();
                    done();
                  });
              });
          });
          test("should not add new region at regions/:newRegionCode", done => {
            database
              .ref(`regions/${post.regionCode}`)
              .once("value")
              .then(snapshot => {
                const region = fromSnapShotToObject(snapshot);
                expect(region).toBeNull();
              })
              .then(() => {
                return editPost({
                  post,
                  postBeforeUpdate,
                  region: newSouthWales
                });
              })
              .then(() => {
                database
                  .ref(`regions/${post.regionCode}`)
                  .once("value")
                  .then(snapshot => {
                    const region = fromSnapShotToObject(snapshot);
                    expect(region).toBeNull();
                    done();
                  });
              });
          });
        });
      });
    });

    describe("was null before update", () => {
      describe("has changed", () => {
        test("should add post at /region-posts/newRegionCode/:id", () => {});
        test("should add new region at country-regions/:countryCode/newRegionCode", () => {});
        test("should add new region at regions/:newRegionCode", () => {});
      });
    });
  });

  describe("placeId", () => {
    describe("was not null before update", () => {
      describe("has not changed", () => {
        test("should edit post at /place-posts/regionCode/:id", () => {});
      });
      describe("has changed", () => {
        describe("and is not null", () => {
          test("should add new place at places/:newPlaceId", () => {});
          test("should add post at /place-posts/newPlaceId/:id", () => {});
          test("should remove post at /place-posts/:formerPlaceId/:id", () => {});
          test("should add new place at region-places/:regionCode/newPlaceId", () => {});
          test("should add new place at country-places/:countryCode/newPlaceId", () => {});
          test("should add new place at user-places/:uid/newPlaceId", () => {});
          test("should remove the former place at user-places/:uid/:formerPlaceId if not another article belonging to that same user talk about the former place", () => {});
        });
        describe("and is null", () => {
          test("should not add new place at places/:newPlaceId", () => {});
          test("should not add place at /region-places/regionCode/:newPlaceId", () => {});
          test("should remove the former place at user-places/:uid/:formerPlaceId if not another article belonging to that same user talk about the former place", () => {});
          test("should not add new region at country-regions/:countryCode/newRegionCode", () => {});
          test("should not add new region at regions/:newRegionCode", () => {});
        });
      });
    });

    describe("was null before update", () => {
      describe("has changed", () => {
        test("should add post at /region-posts/newRegionCode/:id", () => {});
        test("should add new region at country-regions/:countryCode/newRegionCode", () => {});
        test("should add new region at regions/:newRegionCode", () => {});
      });
    });
  });
});

// describe("addPost", () => {
//   let id,
//     post,
//     country,
//     region,
//     place,
//     user,
//     uid,
//     countryCode,
//     regionCode,
//     placeId;

//   beforeEach(done => {
//     ({ id, ...post } = posts[0]);
//     country = france;
//     region = regions[0];
//     place = places[0];
//     user = users[0];

//     const { uid, countryCode, regionCode, placeId } = post;
//     let data = {};

//     data[`posts/${id}`] = post;
//     data[`country-posts/${countryCode}/${id}`] = post;
//     data[`user-posts/${uid}/${id}`] = post;
//     data[`region-posts/${regionCode}/${id}`] = post;
//     data[`/place-posts/${placeId}/${id}`] = post;

//     database
//       .ref()
//       .update(data)
//       .then(() => done());
//   });

//   afterEach(done => {
//     database
//       .ref()
//       .set({})
//       .then(() => {
//         done();
//       });
//   });

//   describe("the post is valid", () => {
//     test("should persist a post at /posts/:postId", done => {
//       addPost({ post, country, user, place, region })
//         .then(() => {
//           return database.ref("posts").once("value");
//         })
//         .then(snapshot => {
//           let posts = fromSnapShotToArray(snapshot);
//           expect(posts.length).toEqual(2);
//           expect(posts[1]).toMatchObject(post);
//           done();
//         });
//     });

//     describe("the countryCode is not null", () => {
//       beforeEach(() => {
//         expect(post.countryCode).toBeDefined();
//         expect(post.countryCode).not.toBeNull();
//       });

//       test("should persist a post at /country-posts/:countryCode/:postId", done => {
//         addPost({ post, user, country, place, region })
//           .then(() => {
//             return database
//               .ref(`/country-posts/${post.countryCode}`)
//               .once("value");
//           })
//           .then(snapshot => {
//             let posts = fromSnapShotToArray(snapshot);
//             expect(posts.length).toEqual(2);
//             expect(posts[1]).toMatchObject(post);
//             done();
//           });
//       });
//     });

//     describe("the countryCode is null", () => {
//       test("should NOT persist a post at /country-posts/:countryCode/:postId", done => {
//         post.countryCode = null;
//         country.countryCode = null;
//         addPost({ post, user, country, place, region })
//           .then(() => {
//             return database
//               .ref(`/country-posts/${posts[0].countryCode}`)
//               .once("value");
//           })
//           .then(snapshot => {
//             let posts = fromSnapShotToArray(snapshot);
//             expect(posts.length).toEqual(1);
//             done();
//           });
//       });
//     });

//     describe("the userId is not null", () => {
//       beforeEach(() => {
//         expect(post.uid).toBeDefined();
//         expect(post.uid).not.toBeNull();
//       });
//       test("should persist a post at /user-posts/:userId/:postId", done => {
//         addPost({ post, user, country, place, region })
//           .then(() => {
//             return database.ref(`/user-posts/${user.uid}`).once("value");
//           })
//           .then(snapshot => {
//             let posts = fromSnapShotToArray(snapshot);
//             expect(posts.length).toEqual(2);
//             expect(posts[1]).toMatchObject(post);
//             done();
//           });
//       });
//     });

//     describe("the userId is null", () => {
//       let { id, ...post } = posts[0];
//       post.uid = null;
//       beforeEach(() => {
//         expect(post.uid).toBeDefined();
//         expect(post.uid).toBeNull();
//       });
//       test("should NOT persist a post at /user-posts/:userId/:postId", done => {
//         addPost(post)
//           .then(() => {
//             return database.ref(`/user-posts/${posts[0].uid}`).once("value");
//           })
//           .then(snapshot => {
//             let posts = fromSnapShotToArray(snapshot);
//             expect(posts.length).toEqual(1);
//             done();
//           });
//       });
//     });

//     describe("the regionCode is not null", () => {
//       let { id, ...post } = posts[0];
//       beforeEach(() => {
//         expect(post.regionCode).toBeDefined();
//         expect(post.regionCode).not.toBeNull();
//       });
//       test("should persist a post at /region-posts/:regionCode/:postId", done => {
//         addPost(post)
//           .then(() => {
//             return database
//               .ref(`/region-posts/${post.regionCode}`)
//               .once("value");
//           })
//           .then(snapshot => {
//             let posts = fromSnapShotToArray(snapshot);
//             expect(posts.length).toEqual(2);
//             expect(posts[1]).toMatchObject(post);
//             done();
//           });
//       });
//     });

//     describe("the regionCode is null", () => {
//       let { id, ...post } = posts[0];
//       post.regionCode = null;
//       beforeEach(() => {
//         expect(post.regionCode).toBeNull();
//       });
//       test("should NOT persist a post at /region-posts/:regionCode/:postId", done => {
//         addPost(post)
//           .then(() => {
//             return database
//               .ref(`/region-posts/${posts[0].regionCode}`)
//               .once("value");
//           })
//           .then(snapshot => {
//             let posts = fromSnapShotToArray(snapshot);
//             expect(posts.length).toEqual(1);
//             done();
//           });
//       });
//     });

//     describe("the placeId is not null", () => {
//       let { id, ...post } = posts[0];
//       beforeEach(() => {
//         expect(post.regionCode).toBeDefined();
//         expect(post.regionCode).not.toBeNull();
//       });
//       test("should persist a post at /place-posts/:placeId/:postId", done => {
//         addPost(post)
//           .then(() => {
//             return database.ref(`/place-posts/${post.placeId}`).once("value");
//           })
//           .then(snapshot => {
//             let posts = fromSnapShotToArray(snapshot);
//             expect(posts.length).toEqual(2);
//             expect(posts[1]).toMatchObject(post);
//             done();
//           });
//       });
//     });

//     describe("the placeId is null", () => {
//       let { id, ...post } = posts[0];
//       post.placeId = null;
//       beforeEach(() => {
//         expect(post.placeId).toBeNull();
//       });
//       test("should NOT persist a post at /place-posts/:placeId/:postId", done => {
//         addPost(post)
//           .then(() => {
//             return database
//               .ref(`/place-posts/${posts[0].placeId}`)
//               .once("value");
//           })
//           .then(snapshot => {
//             let posts = fromSnapShotToArray(snapshot);
//             expect(posts.length).toEqual(1);
//             done();
//           });
//       });
//     });
//   });

//   test("should not persist a post when the title is too short", done => {
//     let { id, ...post } = posts[0];
//     post.title = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE);
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when the title is too long", done => {
//     let { id, ...post } = posts[0];
//     post.title = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_TITLE);
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when the description is too short", done => {
//     let { id, ...post } = posts[0];
//     post.description = generateTooShortString(
//       MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION
//     );
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when the description is too long", done => {
//     let { id, ...post } = posts[0];
//     post.description = generateTooLongString(
//       MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION
//     );
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when createdat is not a number", done => {
//     let { id, ...post } = posts[0];
//     post.createdAt = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when updatedAt is not a number", done => {
//     let { id, ...post } = posts[0];
//     post.updatedAt = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when image is not a string", done => {
//     let { id, ...post } = posts[0];
//     post.image = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when s3FolderName is not a string", done => {
//     let { id, ...post } = posts[0];
//     post.s3FolderName = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when s3FolderName is an empty string", done => {
//     let { id, ...post } = posts[0];
//     post.s3FolderName = "";
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when provideURL is not a boolean", done => {
//     let { id, ...post } = posts[0];
//     post.provideURL = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when providedURL is not a string", done => {
//     let { id, ...post } = posts[0];
//     post.providedURL = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when provideURL is true and providedURL is not a valide URL", done => {
//     let { id, ...post } = posts[0];
//     post.provideURL = true;
//     post.providedURL = "google.com";
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should persist a post when provideURL is false and providedURL is not a valide URL", done => {
//     let { id, ...post } = posts[0];
//     post.provideURL = false;
//     post.providedURL = "google.com";
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(2);
//         done();
//       });
//   });

//   test("should not persist a post when image is a string but not a URL format http(s).www.google.com", done => {
//     let { id, ...post } = posts[0];
//     post.image = "google.com";
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when uid is not a string", done => {
//     let { id, ...post } = posts[0];
//     post.uid = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when uid is an empty string", done => {
//     let { id, ...post } = posts[0];
//     post.uid = "";
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = [];
//         snapshot.forEach(post => {
//           posts.push(post.val());
//         });
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when userName is not a string", done => {
//     let { id, ...post } = posts[0];
//     post.userName = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should not persist a post when userName is an empty string", done => {
//     let { id, ...post } = posts[0];
//     post.userName = "";
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should persist a post when userPhotoURL is not a string", done => {
//     let { id, ...post } = posts[0];
//     post.userPhotoURL = null;
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(2);
//         done();
//       });
//   });

//   test("should not persist a post when userPhotoURL is not in format http(s)://google.com", done => {
//     let { id, ...post } = posts[0];
//     post.userPhotoURL = "google.com";
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(1);
//         done();
//       });
//   });

//   test("should persist a post when userPhotoURL is in format http(s)://google.com", done => {
//     let { id, ...post } = posts[0];
//     post.userPhotoURL = "https://google.com";
//     addPost(post)
//       .then(() => {
//         return database.ref("posts").once("value");
//       })
//       .then(snapshot => {
//         let posts = fromSnapShotToArray(snapshot);
//         expect(posts.length).toEqual(2);
//         done();
//       });
//   });
// });
