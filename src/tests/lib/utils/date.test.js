import moment from 'moment';
import { getDateFormat } from './../../../lib/utils/date';

test('should return the right format when a valid date is passed as an argument', () => {
  expect(getDateFormat(moment())).toEqual('December 31st, 1969')
});

test('should return nil if no date is passed as an argument', () => {
  expect(getDateFormat()).toBeUndefined();
});