import axios from 'axios'

const GOOGLE_MAPS_API = 'https://maps.googleapis.com/maps/api/'

type AddressComponents = {
  country: string
  countryCode: string
  locality: string
  postal_town: string
  administrative_area_level_3: string
  administrative_area_level_2: string
  administrative_area_level_1: string
}

const languageCodes = {
  US: 'en',
  FR: 'fr',
  ES: 'es',
}

export function getAddressComponents(addressComponents: google.maps.GeocoderAddressComponent[]): AddressComponents {
  const country = addressComponents.find((component) => component.types.includes('country'))
  const locality = addressComponents.find((component) => component.types.includes('locality'))
  const postal_town = addressComponents.find((component) => component.types.includes('postal_town'))

  const administrative_area_level_3 = addressComponents.find((component) =>
    component.types.includes('administrative_area_level_3')
  )

  const administrative_area_level_2 = addressComponents.find((component) =>
    component.types.includes('administrative_area_level_2')
  )
  const administrative_area_level_1 = addressComponents.find((component) =>
    component.types.includes('administrative_area_level_1')
  )

  return {
    country: country?.long_name,
    countryCode: country?.short_name,
    locality: locality?.long_name,
    postal_town: postal_town?.long_name,
    administrative_area_level_3: administrative_area_level_3?.long_name,
    administrative_area_level_2: administrative_area_level_2?.long_name,
    administrative_area_level_1: administrative_area_level_1?.long_name,
  }
}

export function getCityName(addressComponents: google.maps.GeocoderAddressComponent[]): string {
  const {
    locality,
    postal_town,
    administrative_area_level_3,
    administrative_area_level_2,
    administrative_area_level_1,
  } = getAddressComponents(addressComponents)

  const administrativeArea = administrative_area_level_3 || administrative_area_level_2 || administrative_area_level_1

  if (locality) return locality + ' ' + administrativeArea

  if (postal_town) return postal_town + ' ' + administrativeArea

  return administrativeArea
}

export function getCountryName(addressComponents: google.maps.GeocoderAddressComponent[]): string {
  const { country } = getAddressComponents(addressComponents)

  return country
}

export function getCountryLanguageCode(addressComponents: google.maps.GeocoderAddressComponent[]): string {
  const { countryCode } = getAddressComponents(addressComponents)
  return languageCodes[countryCode.toUpperCase()] || ''
}

export async function getCityNameWithCountry(googlePlace: google.maps.places.PlaceResult): Promise<string> {
  if (!googlePlace?.address_components) throw new Error('No google place')

  const { address_components: addressComponents } = googlePlace

  const cityName = getCityName(addressComponents)

  return cityName + getCountryName(addressComponents)
}

export async function getGooglePlaceDetails(googlePlaceId: string, language?: string) {
  const response = await axios.get(`${GOOGLE_MAPS_API}place/details/json`, {
    params: {
      language,
      place_id: googlePlaceId,
      key: process.env.GOOGLE_API_KEY,
    },
  })

  if (response.data.status !== 'OK' || typeof response.data.result == 'undefined') return null

  return response.data.result as google.maps.places.PlaceResult | null
}

export async function getGoogleCityByName(cityName: string): Promise<google.maps.GeocoderResult> {
  const { data } = await axios.get<google.maps.GeocoderResponse>(`${GOOGLE_MAPS_API}geocode/json`, {
    params: {
      language: 'fr',
      address: cityName,
      key: process.env.GOOGLE_API_KEY,
    },
  })

  return data.results[0]
}
