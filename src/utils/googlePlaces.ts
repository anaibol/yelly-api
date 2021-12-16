import axios from 'axios'

const key = 'AIzaSyBohCYYvkdmFxcEd4qsqy3CkX-6FVqujPw'
const GOOGLE_MAPS_API = 'https://maps.googleapis.com/maps/api/'

type AddressComponents = {
  country: string
  locality: string
  postal_town: string
  administrative_area_level_3: string
  administrative_area_level_2: string
  administrative_area_level_1: string
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

export async function getCityNameWithCountry(googlePlaceId: string): Promise<string> {
  const { address_components: addressComponents } = await getGooglePlaceDetails(googlePlaceId)

  const cityName = getCityName(addressComponents)

  return cityName + getCountryName(addressComponents)
}

export async function getGooglePlaceDetails(googlePlaceId: string) {
  const response = await axios.get(
    `${GOOGLE_MAPS_API}place/details/json?language=fr&place_id=` + googlePlaceId + '&key=' + key
  )

  if (response.data.status == 'INVALID_REQUEST' || typeof response.data.result == 'undefined') return null

  return response.data.result as google.maps.places.PlaceResult | null
}

export async function getGoogleCityByName(cityName: string): Promise<google.maps.GeocoderResult> {
  const { data } = await axios.get<google.maps.GeocoderResponse>(`${GOOGLE_MAPS_API}geocode/json`, {
    params: {
      language: 'fr',
      address: cityName,
      key: key,
    },
  })

  return data.results[0]
}