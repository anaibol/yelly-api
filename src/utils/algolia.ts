import { UserIndexAlgoliaInterface } from 'src/user/user-index-algolia.interface'

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

export function mapAlgoliaUser(user): UserIndexAlgoliaInterface {
  return {
    id: this.prismaService.mapBufferIdToString(user.id),
    objectID: this.prismaService.mapBufferIdToString(user.id),
    lastName: user.lastName,
    firstName: user.firstName,
    birthdateTimestamp: user.birthdate ? Date.parse(user.birthdate.toString()) : null,
    hasPicture: user.pictureId != null,
    training: {
      id: this.prismaService.mapBufferIdToString(user.training.id),
      name: user.training.name,
    },
    school: {
      id: this.prismaService.mapBufferIdToString(user.school.id),
      name: user.school.name,
      postalCode: user.school.postalCode,
      googlePlaceId: user.school.googlePlaceId,
      city: {
        id: this.prismaService.mapBufferIdToString(user.school.city.id),
        name: user.school.city.name,
        googlePlaceId: user.school.city.googlePlaceId,
        country: {
          id: this.prismaService.mapBufferIdToString(user.school.city.country.id),
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
