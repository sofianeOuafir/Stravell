const setTextFilter = (text = '') => ({
  type: 'SET_TEXT_FILTER',
  text
});

const setCountryFilter = (countryCode = '') => ({
  type: 'SET_COUNTRY_FILTER',
  countryCode
});

export { setTextFilter, setCountryFilter };