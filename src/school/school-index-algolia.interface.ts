export interface SchoolIndexAlgoliaInterface {
  id: string
  name: string
  googlePlaceId: string
  _geoloc: {
    lat: number
    lng: number
  }
  city: {
    id: string
    name: string
    _geoloc: {
      lat: number
      lng: number
    }
    country: {
      id: string
      name: string
    }
  }
  userCount: number
}
