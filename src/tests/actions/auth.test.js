import { login, logout } from '../../actions/auth';

test('should generate login action object', () => {
  const uid = 'abc123';
  const userName = 'Sofiane';
  const userPhotoURL = 'myURL';

  const action = login({uid, userName, userPhotoURL});
  expect(action).toEqual({
    type: 'LOGIN',
    uid,
    userName,
    userPhotoURL
  });
});

test('should generate logout action object', () => {
  const action = logout();
  expect(action).toEqual({
    type: 'LOGOUT'
  });
});
