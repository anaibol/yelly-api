import { stringify as uuidStringify } from 'uuid'

export type UserIndexAlgoliaInterface = {
  id: string
  objectID: string
  firstName: string
  lastName: string
  pictureId: string
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

export const algoliaUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  isFilled: true,
  pictureId: true,
  birthdate: true,
  training: {
    select: {
      id: true,
      name: true,
    },
  },
  school: {
    select: {
      id: true,
      name: true,
      postalCode: true,
      googlePlaceId: true,
      lat: true,
      lng: true,
      city: {
        select: {
          id: true,
          name: true,
          googlePlaceId: true,
          lat: true,
          lng: true,
          country: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
}

const bufferIdToString = (buffer: Buffer) => uuidStringify(Buffer.from(buffer))

export function mapAlgoliaUser(user): UserIndexAlgoliaInterface {
  return {
    id: bufferIdToString(user.id),
    objectID: bufferIdToString(user.id),
    firstName: user.firstName,
    lastName: user.lastName,
    pictureId: user.pictureId,
    birthdateTimestamp: user.birthdate ? Date.parse(user.birthdate.toString()) : null,
    hasPicture: user.pictureId != null,
    training: {
      id: bufferIdToString(user.training.id),
      name: user.training.name,
    },
    school: {
      id: bufferIdToString(user.school.id),
      name: user.school.name,
      postalCode: user.school.postalCode,
      googlePlaceId: user.school.googlePlaceId,
      city: {
        id: bufferIdToString(user.school.city.id),
        name: user.school.city.name,
        googlePlaceId: user.school.city.googlePlaceId,
        country: {
          id: bufferIdToString(user.school.city.country.id),
          name: user.school.city.country.name,
        },
        _geoloc: {
          lat: user.school.city.lat,
          lng: user.school.city.lng,
        },
      },
      _geoloc: {
        lat: user.school.lat,
        lng: user.school.lng,
      },
    },
  }
}