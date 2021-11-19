export interface UserIndexAlgoliaInterface {
  lastName: string
  firstName: string
  birthdateTimestamp: number
  hasPicture: boolean
  id: string
  lastTraining: {
    id: string
    training: {
      id: string
      name: string
    }
    school: {
      id: string
      name: string
      countryName: string
      postalCode: string
      googlePlaceId: string
      _geoloc: {
        lat: string
        lng: string
      }
    }
  }
}
