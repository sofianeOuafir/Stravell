const setTextFilter = (text = '') => ({
  type: 'SET_TEXT_FILTER',
  text
});

const setCountryFilter = (country = '') => ({
  type: 'SET_COUNTRY_FILTER',
  country
});

export { setTextFilter, setCountryFilter };