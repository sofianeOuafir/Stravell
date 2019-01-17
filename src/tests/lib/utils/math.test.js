import { isOdd } from './../../../lib/utils/math';

test('should return true if number passed as an argument is odd', () => {
  expect(isOdd(1)).toEqual(true);
});

test('should return false if number passed as an argument is even', () => {
  expect(isOdd(2)).toEqual(false);
});

test('should return undefined if no number passed as an argument', () => {
  expect(isOdd()).toBeUndefined();
});