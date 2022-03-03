export interface SchoolIndexAlgoliaInterface {
  id: string
  name: string
  googlePlaceId: string | null
  _geoloc: {
    lat: number | null
    lng: number | null
  }
  city: {
    id: string
    name: string
    _geoloc: {
      lat: number | null
      lng: number | null
    }
    country: {
      id: string
      code: string
    }
  }
  userCount: number
}
