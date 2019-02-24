import { addPost } from "./../../queries/post";
import posts from "./../fixtures/posts";
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

describe("addPost", () => {
  beforeEach(done => {
    const { id, ...post } = posts[0];
    const { uid, countryCode, regionCode, placeId } = post;
    let data = {};

    data[`posts/${id}`] = post;
    data[`country-posts/${countryCode}/${id}`] = post;
    data[`user-posts/${uid}/${id}`] = post;
    data[`region-posts/${regionCode}/${id}`] = post;
    data[`/place-posts/${placeId}/${id}`] = post;
    // data[`countries/${post.countryCode}`] = post.country;
    // data[`user-countries/${post.uid}/${post.countryCode}/country`] =
    // post.country;

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

  describe("the post is valid", () => {
    test("should persist a post at /posts/:postId", done => {
      let { id, ...post } = posts[0];
      addPost(post)
        .then(() => {
          return database.ref("posts").once("value");
        })
        .then(snapshot => {
          let posts = fromSnapShotToArray(snapshot);
          expect(posts.length).toEqual(2);
          expect(posts[1]).toMatchObject(post);
          done();
        });
    });

    describe("the countryCode is present", () => {
      let { id, ...post } = posts[0];
      beforeEach(() => {
        expect(post.countryCode).toBeDefined();
        expect(post.countryCode).not.toBeNull();
      });

      test("should persist a post at /country-posts/:countryCode/:postId", done => {
        addPost(post)
          .then(() => {
            return database
              .ref(`/country-posts/${post.countryCode}`)
              .once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(2);
            expect(posts[1]).toMatchObject(post);
            done();
          });
      });
    });

    describe("the countryCode is NOT present", () => {});

    describe("the userId is present", () => {
      let { id, ...post } = posts[0];
      beforeEach(() => {
        expect(post.uid).toBeDefined();
        expect(post.uid).not.toBeNull();
      });
      test("should persist a post at /user-posts/:userId/:postId", done => {
        addPost(post)
          .then(() => {
            return database.ref(`/user-posts/${post.uid}`).once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(2);
            expect(posts[1]).toMatchObject(post);
            done();
          });
      });
    });

    describe("the userId is NOT present", () => {});

    describe("the regionCode is present", () => {
      let { id, ...post } = posts[0];
      beforeEach(() => {
        expect(post.regionCode).toBeDefined();
        expect(post.regionCode).not.toBeNull();
      });
      test("should persist a post at /region-posts/:regionCode/:postId", done => {
        let { id, ...post } = posts[0];
        addPost(post)
          .then(() => {
            return database
              .ref(`/region-posts/${post.regionCode}`)
              .once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(2);
            expect(posts[1]).toMatchObject(post);
            done();
          });
      });
    });

    describe("the regionCode is NOT present", () => {});

    describe("the placeId is present", () => {
      let { id, ...post } = posts[0];
      beforeEach(() => {
        expect(post.regionCode).toBeDefined();
        expect(post.regionCode).not.toBeNull();
      });
      test("should persist a post at /place-posts/:placeId/:postId", done => {
        addPost(post)
          .then(() => {
            return database.ref(`/place-posts/${post.placeId}`).once("value");
          })
          .then(snapshot => {
            let posts = fromSnapShotToArray(snapshot);
            expect(posts.length).toEqual(2);
            expect(posts[1]).toMatchObject(post);
            done();
          });
      });
    });
    describe("the placeId is NOT present", () => {});
  });

  describe("the post is not valid", () => {});

  // describe("region and regionCode data are present", () => {
  //   test("should persist a valid post at /region-posts/:regionCode/:id", done => {
  //     let { id, ...post } = posts[0];
  //     store
  //       .dispatch(startAddPost(post))
  //       .then(() => {
  //         return database.ref(`/region-posts/${post.regionCode}`).once("value");
  //       })
  //       .then(snapshot => {
  //         let posts = fromSnapShotToArray(snapshot);
  //         expect(posts.length).toEqual(2);
  //         expect(posts[1]).toMatchObject(post);
  //         done();
  //       });
  //   });
  //   describe("the region of that post has not yet been persisted at /regions/:regionCode", () => {
  //     // verify setup
  //     beforeEach(done => {
  //       database
  //         .ref(`/regions/${posts[0].regionCode}`)
  //         .once("value")
  //         .then(snapshot => {
  //           let region = fromSnapShotToObject(snapshot);
  //           expect(region).toEqual(null);
  //           done();
  //         });
  //     });

  //     test("should add new region at /regions/:regionCode with right values", done => {
  //       let { id, ...post } = posts[0];
  //       store
  //         .dispatch(startAddPost(post))
  //         .then(() => {
  //           return database.ref(`/regions/${post.regionCode}`).once("value");
  //         })
  //         .then(snapshot => {
  //           let region = fromSnapShotToObject(snapshot);
  //           expect(region).toMatchObject({
  //             id: post.regionCode,
  //             region: post.region,
  //             country: post.country,
  //             countryCode: post.countryCode,
  //             northeastLat: expect.anything(),
  //             northeastLng: expect.anything(),
  //             southWestLat: expect.anything(),
  //             southWestLng: expect.anything()
  //           });
  //           // expect(posts.length).toEqual(2);
  //           // expect(posts[1]).toMatchObject(post);
  //           done();
  //         });
  //     });
  //   });
  // });

  // describe("region and regionCode data are NOT present", () => {
  //   test("should NOT persist a valid post at /region-posts/:regionCode/:id", done => {
  //     let { id, ...post } = posts[0];
  //     post.regionCode = null;
  //     post.region = null;
  //     store
  //       .dispatch(startAddPost(post))
  //       .then(() => {
  //         return database
  //           .ref(`/region-posts/${posts[0].regionCode}`)
  //           .once("value");
  //       })
  //       .then(snapshot => {
  //         let posts = fromSnapShotToArray(snapshot);
  //         expect(posts.length).toEqual(1);
  //         done();
  //       });
  //   });
  // });

  // test("should persist a new country at /countries", done => {
  //   let { id, ...post } = posts[0];
  //   let country = { id: "BR", country: "Brazil" };
  //   post.countryCode = country.id;
  //   post.country = country.country;
  //   store
  //     .dispatch(startAddPost(post))
  //     .then(() => {
  //       return database.ref(`/countries/${post.countryCode}`).once("value");
  //     })
  //     .then(snapshot => {
  //       let result = fromSnapShotToObject(snapshot);
  //       expect(result).toEqual(country);
  //     })
  //     .then(() => {
  //       return database.ref(`/countries`).once("value");
  //     })
  //     .then(snapshot => {
  //       const result = fromSnapShotToArray(snapshot);
  //       expect(result.length).toEqual(2);
  //       done();
  //     });
  // });

  // test("should persist a new country at /user-countries/:uid", done => {
  //   let { id, ...post } = posts[0];
  //   let country = { id: "BR", country: "Brazil" };
  //   post.countryCode = country.id;
  //   post.country = country.country;
  //   store
  //     .dispatch(startAddPost(post))
  //     .then(() => {
  //       return database
  //         .ref(`/user-countries/${post.uid}/${post.countryCode}`)
  //         .once("value");
  //     })
  //     .then(snapshot => {
  //       let result = fromSnapShotToObject(snapshot);
  //       expect(result).toEqual(country);
  //     })
  //     .then(() => {
  //       return database.ref(`/user-countries/${post.uid}`).once("value");
  //     })
  //     .then(snapshot => {
  //       const result = fromSnapShotToArray(snapshot);
  //       expect(result.length).toEqual(2);
  //       done();
  //     });
  // });

  test("should not persist a post when the title is too short", done => {
    let { id, ...post } = posts[0];
    post.title = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE);
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when the title is too long", done => {
    let { id, ...post } = posts[0];
    post.title = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_TITLE);
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
        expect(posts.length).toEqual(1);
        done();
      });
  });

  test("should not persist a post when the description is too short", done => {
    let { id, ...post } = posts[0];
    post.description = generateTooShortString(
      MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION
    );
    addPost(post)
      .then(() => {
        return database.ref("posts").once("value");
      })
      .then(snapshot => {
        let posts = fromSnapShotToArray(snapshot);
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
