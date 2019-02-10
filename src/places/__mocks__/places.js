export const getLocationData = () => {
  console.log('salut toi')
  return Promise.resolve({ lat: 1.2342, lng: 1.1123, country: 'Brazil', countryCode: 'BR' })
}