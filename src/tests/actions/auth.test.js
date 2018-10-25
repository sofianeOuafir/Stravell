import { login, logout } from '../../actions/auth';

test('should generate login action object', () => {
  const uid = 'abc123';
  const displayName = 'Sofiane';
  const photoURL = 'myURL';

  const action = login({uid, displayName, photoURL});
  expect(action).toEqual({
    type: 'LOGIN',
    uid,
    displayName,
    photoURL
  });
});

test('should generate logout action object', () => {
  const action = logout();
  expect(action).toEqual({
    type: 'LOGOUT'
  });
});
