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
    const postsData = {};
    posts.forEach(
      ({
        id,
        body,
        createdAt,
        description,
        image,
        s3FolderName,
        title,
        uid,
        updatedAt,
        userName,
        provideURL,
        providedURL,
        userPhotoURL
      }) => {
        postsData[id] = {
          body,
          createdAt,
          description,
          image,
          s3FolderName,
          title,
          uid,
          updatedAt,
          userName,
          provideURL,
          providedURL,
          userPhotoURL
        };
      }
    );
    database
      .ref(`posts`)
      .set(postsData)
      .then(() => done());
  });

  test("should persist a valid post", done => {
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

  test("should not persist a post when userPhotoURL is not a string", done => {
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
        expect(posts.length).toEqual(1);
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
});

const fromSnapShotToObject = snapshot => {
  if (snapshot.val() === null) {
    return null;
  }
  return { id: snapshot.key, ...snapshot.val() };
};

describe("startEditPost", () => {
  let post = posts[0];
  let store;
  const postBeforeUpdate = Object.assign({}, post);
  beforeEach(done => {
    store = createMockStore(defaultAuthState);
    const postData = {};
    const { id, ...rest } = post;
    postData[post.id] = { ...rest };
    let data = {};
    data[`/posts/${post.id}`] = postData[post.id];
    data[`/users/${post.uid}/posts/${post.id}`] = postData[post.id];
    data[`/countries/${post.countryCode}/posts/${post.id}`] = postData[post.id];
    data[`/countries/${post.countryCode}/country`] = post.country;
    data[`/users/${post.uid}/countries/${post.countryCode}`] = post.country;

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

  test("should edit post at /posts/:id", done => {
    const updates = { ...post, country: "Brazil", title: "my updated title" };
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

  test("should edit post at /users/:uid/posts/:id", done => {
    const updates = { ...post, country: "Brazil", title: "my updated title" };
    store
      .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
      .then(() => {
        return database.ref(`users/${uid}/posts/${post.id}`).once("value");
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
      test("should edit post at /countries/:countryCode/posts/:id", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database
              .ref(`countries/${postBeforeUpdate.countryCode}/posts/${post.id}`)
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

        test("should edit post at /countries/:newCountryCode/posts/:id", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`countries/${updates.countryCode}/posts/${post.id}`)
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

        test("should remove the post under /countries/:formerCountryCode/posts", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(
                  `countries/${postBeforeUpdate.countryCode}/posts/${post.id}`
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
        test("should add the post under /countries/:newCountryCode/posts", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`countries/${updates.countryCode}/posts/${post.id}`)
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
        test("should add countries/:newCountryCode collection if doesn't exist yet", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`countries/${updates.countryCode}`)
                .once("value");
            })
            .then(snapshot => {
              const result = fromSnapShotToObject(snapshot);
              expect(result.id).toEqual(updates.countryCode);
              done();
            })
            .catch(e => {
              console.log(e);
            });
        });
        test("should remove the collection countries/:formerCountryCode if not another article talk about this country", done => {
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
        test("should add the new country under users/:uid/countries if doesn't exist yet", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`users/${uid}/countries/${updates.countryCode}`)
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
        test("should remove the former country under users/:uid/countries if not another article belonging to that same user talk about the former country", done => {
          return store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`users/${uid}/countries/${postBeforeUpdate.countryCode}`)
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

        test("should not add the post under /countries/:newCountryCode/posts", done => {
          console.log("yaaaa: ", updates.countryCode);
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`countries/${updates.countryCode}/posts/${post.id}`)
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

        test("should remove the collection countries/:formerCountryCode if not another article talk about this country", done => {
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

        test("should remove the former country under users/:uid/countries if not another article belonging to that same user talk about the former country", done => {
          return store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(`users/${uid}/countries/${postBeforeUpdate.countryCode}`)
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

        test("should remove the post under /countries/:formerCountryCode/posts", done => {
          store
            .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
            .then(() => {
              return database
                .ref(
                  `countries/${postBeforeUpdate.countryCode}/posts/${post.id}`
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
      test("should add the post under /countries/:newCountryCode/posts", done => {
        store
          .dispatch(startEditPost({ id: post.id, postBeforeUpdate, updates }))
          .then(() => {
            return database
              .ref(`countries/${updates.countryCode}/posts/${updates.id}`)
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
      test("should add countries/:newCountryCode collection if doesn't exist yet", done => {
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
    });
  });
});
