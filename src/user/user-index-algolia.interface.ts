export interface UserIndexAlgoliaInterface {
  id: string
  objectID: string
  lastName: string
  firstName: string
  birthdateTimestamp: number
  hasPicture: boolean
  training: {
    id: string
    name: string
  }
  school: {
    id: string
    name: string
    postalCode: string
    googlePlaceId: string
    city: {
      id: string
      name: string
      googlePlaceId: string
      country?: {
        id: string
        name: string
      }
      _geoloc: {
        lat: number
        lng: number
      }
    }
    _geoloc: {
      lat: number
      lng: number
    }
  }
}
