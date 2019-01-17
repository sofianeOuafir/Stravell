import { setTextFilter } from './../../actions/filters';

test('should return the right value', () => {
  const text = 'my text';
  expect(setTextFilter(text)).toEqual({ type: 'SET_TEXT_FILTER', text })
});