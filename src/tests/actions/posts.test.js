import {
  addPost,
  editPost,
  setPosts,
  startAddPost,
  startEditPost
} from "./../../actions/posts";
import posts from "./../fixtures/posts";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
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
import { fromSnapShotToObject, fromSnapShotToArray } from './../../lib/utils/snapshot';

const uid = "YYFEgQAdBuQIsox3ojncZtpSAmG3";
const userName = "Jenna Jacquelyn";
const userPhotoURL = "https://graph.facebook.com/10161147754845459/picture";

const defaultAuthState = { auth: { uid, userName, userPhotoURL } };
const createMockStore = configureMockStore([thunk]);

describe("addPost", () => {
  test("should return the right value", () => {
    const post = posts[0];
    expect(addPost(post)).toEqual({ type: "ADD_POST", post });
  });
});

describe("setPosts", () => {
  test("should return the right value", () => {
    expect(setPosts(posts)).toEqual({ type: "SET_POSTS", posts });
  });
});

describe("editPost", () => {
  test("should return the right value", () => {
    const title = "a new title";
    const updates = { title };
    const id = 1;
    expect(editPost({ id, updates })).toEqual({
      type: "EDIT_POST",
      id,
      updates
    });
  });
});

describe("startAddPost", () => {
  let store;

  beforeEach(done => {
    store = createMockStore(defaultAuthState);
    const { id, ...post } = posts[0];
    let data = {};

    data[`posts/${id}`] = post;
    data[`user-posts/${post.uid}/${id}`] = post;
    data[`region-posts/${post.regionCode}/${id}`] = post;
    data[`country-posts/${post.countryCode}/${id}`] = post;
    data[`countries/${post.countryCode}`] = post.country;
    data[`user-countries/${post.uid}/${post.countryCode}/country`] =
      post.country;

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

  test("should persist a valid post at /posts", done => {
    let { id, ...post } = posts[0];
    post.title = "My amazing blog post";
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(2);
        expect(posts[1]).toEqual(post);
        done();
      });
  });

  test("should persist a valid post at /country-posts/:newCountryCode/:id", done => {
    let { id, ...post } = posts[0];
    post.title = "My amazing blog post";
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref(`/country-posts/${post.countryCode}`).once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(2);
        expect(posts[1]).toEqual(post);
        done();
      });
  });

  test("should persist a valid post at /user-posts/:uid/:id", done => {
    let { id, ...post } = posts[0];
    post.title = "My amazing blog post";
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref(`/user-posts/${post.uid}`).once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(2);
        expect(posts[1]).toEqual(post);
        done();
      });
  });

  describe('region and regionCode data are present', () => {
    test("should persist a valid post at /region-posts/:regionCode/:id", done => {
      let { id, ...post } = posts[0];
      store
        .dispatch(startAddPost(post))
        .then(() => {
          return database.ref(`/region-posts/${post.regionCode}`).once("value");
        })
        .then(snapshot => {
          let posts = fromSnapShotToArray(snapshot);
          expect(posts.length).toEqual(2);
          expect(posts[1]).toMatchObject(post);
          done();
        });
    });
    describe('the region of that post has not yet been persisted at /regions/:regionCode', () => {
      // verify setup
      beforeEach((done) => {
        database.ref(`/regions/${posts[0].regionCode}`).once("value")
        .then(snapshot => {
          let region = fromSnapShotToObject(snapshot);
          expect(region).toEqual(null);
          done();
        });
      });

      test('should add new region at /regions/:regionCode with right values', (done) => {
        let { id, ...post } = posts[0];
        store
          .dispatch(startAddPost(post))
          .then(() => {
            return database.ref(`/regions/${post.regionCode}`).once("value");
          })
          .then(snapshot => {
            let region = fromSnapShotToObject(snapshot);
            expect(region).toMatchObject({
              id: post.regionCode,
              region: post.region,
              country: post.country,
              countryCode: post.countryCode,
              northeastLat: expect.anything(),
              northeastLng: expect.anything(),
              southWestLat: expect.anything(),
              southWestLng: expect.anything()
            });
            // expect(posts.length).toEqual(2);
            // expect(posts[1]).toMatchObject(post);
            done();
          });
      })
    })
  });

  describe('region and regionCode data are NOT present', () => {
    test("should NOT persist a valid post at /region-posts/:regionCode/:id", done => {
      let { id, ...post } = posts[0];
      post.regionCode = null;
      post.region = null;
      store
        .dispatch(startAddPost(post))
        .then(() => {
          return database.ref(`/region-posts/${posts[0].regionCode}`).once("value");
        })
        .then(snapshot => {
          let posts = fromSnapShotToArray(snapshot);
          expect(posts.length).toEqual(1);
          done();
        });
    });
  });

  test("should persist a new country at /countries", done => {
    let { id, ...post } = posts[0];
    let country = { id: 'BR', country: 'Brazil' };
    post.countryCode = country.id;
    post.country = country.country;
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref(`/countries/${post.countryCode}`).once("value");
      })
      .then(snapshot => {
        let result = fromSnapShotToObject(snapshot);
        expect(result).toEqual(country);
      }).then(() => {
        return database.ref(`/countries`).once("value");
      }).then((snapshot) => {
        const result = fromSnapShotToArray(snapshot);
        expect(result.length).toEqual(2);
        done();
      })
  });

  test("should persist a new country at /user-countries/:uid", done => {
    let { id, ...post } = posts[0];
    let country = { id: 'BR', country: 'Brazil' };
    post.countryCode = country.id;
    post.country = country.country;
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref(`/user-countries/${post.uid}/${post.countryCode}`).once("value");
      })
      .then(snapshot => {
        let result = fromSnapShotToObject(snapshot);
        expect(result).toEqual(country);
      }).then(() => {
        return database.ref(`/user-countries/${post.uid}`).once("value");
      }).then((snapshot) => {
        const result = fromSnapShotToArray(snapshot);
        expect(result.length).toEqual(2);
        done();
      })
  });

  test("should not persist a post when the title is too short", done => {
    let { id, ...post } = posts[0];
    post.title = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE);
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when the title is too long", done => {
    let { id, ...post } = posts[0];
    post.title = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_TITLE);
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when the description is too short", done => {
    let { id, ...post } = posts[0];
    post.description = generateTooShortString(
      MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION
    );
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when the description is too long", done => {
    let { id, ...post } = posts[0];
    post.description = generateTooLongString(
      MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION
    );
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when createdat is not a number", done => {
    let { id, ...post } = posts[0];
    post.createdAt = null;
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when updatedAt is not a number", done => {
    let { id, ...post } = posts[0];
    post.updatedAt = null;
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when image is not a string", done => {
    let { id, ...post } = posts[0];
    post.image = null;
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when s3FolderName is not a string", done => {
    let { id, ...post } = posts[0];
    post.s3FolderName = null;
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when s3FolderName is an empty string", done => {
    let { id, ...post } = posts[0];
    post.s3FolderName = "";
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when provideURL is not a boolean", done => {
    let { id, ...post } = posts[0];
    post.provideURL = null;
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when providedURL is not a string", done => {
    let { id, ...post } = posts[0];
    post.providedURL = null;
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when provideURL is true and providedURL is not a valide URL", done => {
    let { id, ...post } = posts[0];
    post.provideURL = true;
    post.providedURL = "google.com";
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when image is a string but not a URL format http(s).www.google.com", done => {
    let { id, ...post } = posts[0];
    post.image = "google.com";
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when uid is not a string", done => {
    store = createMockStore({ auth: { uid: null, userName, userPhotoURL } });
    let { id, ...post } = posts[0];
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when uid is an empty string", done => {
    store = createMockStore({ auth: { uid: "", userName, userPhotoURL } });
    let { id, ...post } = posts[0];
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when userName is not a string", done => {
    store = createMockStore({ auth: { uid, userName: null, userPhotoURL } });
    let { id, ...post } = posts[0];
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when userName is an empty string", done => {
    store = createMockStore({ auth: { uid, userName: "", userPhotoURL } });
    let { id, ...post } = posts[0];
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should persist a post when userPhotoURL is not a string", done => {
    store = createMockStore({ auth: { uid, userName, userPhotoURL: null } });
    let { id, ...post } = posts[0];
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(2);
        done();
      });
  });

  test("should not persist a post when userPhotoURL is not in format http(s)://google.com", done => {
    store = createMockStore({
      auth: { uid, userName, userPhotoURL: "google.com" }
    });
    let { id, ...post } = posts[0];
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should persist a post when userPhotoURL is in format http(s)://google.com", done => {
    store = createMockStore({
      auth: { uid, userName, userPhotoURL: "https://google.com" }
    });
    let { id, ...post } = posts[0];
    store
      .dispatch(startAddPost(post))
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = [];
        snapshot.forEach(post => {
          posts.push(post.val());
        });
        expect(posts.length).toEqual(2);
        done();
      });
  });
});

describe("startEditPost", () => {
  let store;
  const postBeforeUpdate = Object.assign({}, posts[0]);
  let post = posts[0];
  beforeEach(done => {
    store = createMockStore(defaultAuthState);
    const { id, ...postWithoutId } = post;
    let data = {};
    data[`/posts/${id}`] = postWithoutId;
    data[`/user-posts/${post.uid}/${id}`] = postWithoutId;
    data[`/country-posts/${post.countryCode}/${id}`] = postWithoutId;
    data[`/countries/${post.countryCode}/country`] = post.country;
    data[`/user-countries/${post.uid}/${post.countryCode}`] = post.country;

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

  describe("the country and countryCode was present before", () => {
    // verify test setup
    beforeEach(() => {
      expect(postBeforeUpdate.country).toBeDefined();
      expect(postBeforeUpdate.countryCode).toBeDefined();
    });

    describe("the country and countryCode has not changed", () => {
      const updates = { ...post, title: "my updated title" };
      // veryify setup
      beforeEach(() => {
        expect(updates.country).toEqual(postBeforeUpdate.country);
        expect(updates.countryCode).toEqual(postBeforeUpdate.countryCode);
      });

      test("should edit post at /posts/:id", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database.ref(`posts/${post.id}`).once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toMatchObject(updates);
            done();
          })
          .catch(e => {
            console.log(e);
          });
      });

      test("should edit post at /user-posts/:uid/:id", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database.ref(`user-posts/${uid}/${post.id}`).once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toMatchObject(updates);
            done();
          })
          .catch(e => {
            console.log(e);
          });
      });

      test("should edit post at /country-posts/:countryCode/:id", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database
              .ref(`country-posts/${postBeforeUpdate.countryCode}/${post.id}`)
              .once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toMatchObject(updates);
            done();
          })
          .catch(e => {
            console.log(e);
          });
      });
    });

    describe("the country and countryCode has changed", () => {
      describe("and is still present", () => {
        const updates = { ...post, country: "Brazil", countryCode: "BR" };
        // veryify setup
        beforeEach(() => {
          expect(updates.country).not.toEqual(postBeforeUpdate.country);
          expect(updates.countryCode).not.toEqual(postBeforeUpdate.countryCode);
          expect(updates.countryCode).toBeDefined();
          expect(updates.country).toBeDefined();
        });

        test("should edit post at /posts/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database.ref(`posts/${post.id}`).once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject(updates);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should edit post at /user-posts/:uid/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`user-posts/${uid}/${post.id}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject(updates);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should add the post at /country-posts/:newCountryCode/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`country-posts/${updates.countryCode}/${post.id}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(updates);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should remove the post at /country-posts/:formerCountryCode/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(
                  `country-posts/${postBeforeUpdate.countryCode}/${post.id}`
                )
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });
        test("should add new country at countries/:newCountryCode", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`countries/${updates.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject({
                id: updates.countryCode,
                country: updates.country
              });
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });
        test("should remove the former country at countries/:formerCountryCode if not another article talk about this country", done => {
          return store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`countries/${postBeforeUpdate.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should add the new country at user-countries/:uid/:newCountryCode", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`user-countries/${uid}/${updates.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject({
                id: updates.countryCode,
                country: updates.country
              });
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });
        test("should remove the former country at user-countries/:uid/:formerCountry if not another article belonging to that same user talk about the former country", done => {
          return store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`user-countries/${uid}/${postBeforeUpdate.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });
      });

      describe("and has been removed", () => {
        const updates = { ...post, country: "", countryCode: "" };
        // veryify setup
        beforeEach(() => {
          expect(updates.country).not.toEqual(postBeforeUpdate.country);
          expect(updates.countryCode).not.toEqual(postBeforeUpdate.countryCode);
          expect(updates.country).toEqual("");
          expect(updates.countryCode).toEqual("");
        });

        test("should edit post at /posts/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database.ref(`posts/${post.id}`).once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject(updates);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should edit post at /user-posts/:uid/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`user-posts/${uid}/${post.id}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toMatchObject(updates);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should not add a new country at countries/:newCountryCode", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`countries/${updates.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should not add a new country at user-countries/:uid/:newCountryCode", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`user-countries/${uid}/${updates.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should not add the post at /country-posts/:newCountryCode/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`country-posts/${updates.countryCode}/${post.id}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should remove the former country at countries/:formerCountryCode if not another article talk about this country", done => {
          return store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`countries/${postBeforeUpdate.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should remove the former country at user-countries/:uid/:formerCountryCode if not another article belonging to that same user talk about the former country", done => {
          return store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`user-countries/${uid}/${postBeforeUpdate.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });

        test("should remove the post at /country-posts/:formerCountryCode/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(
                  `country-posts/${postBeforeUpdate.countryCode}/${post.id}`
                )
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result).toEqual(null);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });
      });
    });
  });

  describe("the country and countryCode was not present before", () => {
    beforeEach(() => {
      postBeforeUpdate.country = "";
      postBeforeUpdate.countryCode = "";
      // verify setup
      expect(postBeforeUpdate.country).toBeDefined();
      expect(postBeforeUpdate.countryCode).toBeDefined();
    });

    describe("the country and countryCode has changed", () => {
      const updates = { ...post, country: "Brazil", countryCode: "BR" };
      beforeEach(() => {
        expect(updates.country).not.toEqual(postBeforeUpdate.country);
        expect(updates.countryCode).not.toEqual(postBeforeUpdate.countryCode);
      });

      test("should edit post at /posts/:id", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database.ref(`posts/${post.id}`).once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toMatchObject(updates);
            done();
          })
          .catch(e => {
            console.log(e);
          });
      });

      test("should edit post at /user-posts/:uid/:id", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database.ref(`user-posts/${uid}/${post.id}`).once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toMatchObject(updates);
            done();
          })
          .catch(e => {
            console.log(e);
          });
      });

      test("should add the post at /country-posts/:newCountryCode/:id", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database
              .ref(`country-posts/${updates.countryCode}/${updates.id}`)
              .once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toEqual(updates);
            done();
          })
          .catch(e => {
            console.log(e);
          });
      });
      test("should add the new country at countries/:newCountryCode", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database
              .ref(`countries/${updates.countryCode}`)
              .once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toMatchObject({
              id: result.id,
              country: result.country
            });
            done();
          })
          .catch(e => {
            console.log(e);
          });
      });
      test("should add the new country at user-countries/:uid/:newCountryCode", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database
              .ref(`user-countries/${uid}/${updates.countryCode}`)
              .once("value");
          })
          .then(snapshot => {
            const result = fromSnapShotToObject(snapshot);
            expect(result).toMatchObject({
              id: result.id,
              country: result.country
            });
            done();
          })
          .catch(e => {
            console.log(e);
          });
      });
    });
  });
});
