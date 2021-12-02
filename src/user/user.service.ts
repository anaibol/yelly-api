import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import axios from 'axios'
import * as bcrypt from 'bcrypt'
import { randomBytes, randomUUID } from 'crypto'
import { DEFAULT_LIMIT } from '../common/pagination.constant'
import { AlgoliaService } from '../core/algolia.service'
import { EmailService } from '../core/email.service'
import { PrismaService } from '../core/prisma.service'
import { SendbirdService } from '../core/sendbird.service'
import { SchoolService } from '../user-training/school.service'
import { SignUpInput } from './sign-up.input'
import { UpdateUserInput } from './update-user.input'
import { NotFoundUserException } from './not-found-user.exception'
import { UserIndexAlgoliaInterface } from './user-index-algolia.interface'

const cleanUndefinedFromObj = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v === undefined ? a : ((a[k] = v), a)), {})

@Injectable()
export class UserService {
  googleApiKey = process.env.GOOGLE_API_KEY
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private algoliaService: AlgoliaService,
    private schoolService: SchoolService,
    private sendbirdService: SendbirdService
  ) {}

  async hasUserPostedOnTag(email, tagText) {
    const post = await this.prismaService.post.findFirst({
      select: {
        id: true,
      },
      where: {
        author: {
          email: email,
        },
        tags: {
          some: {
            text: tagText,
          },
        },
      },
    })

    return post != null
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    })

    return {
      ...user,
      id: this.prismaService.mapBufferIdToString(user.id),
    }
  }

  async findOne(userId) {
    const bufferId = this.prismaService.mapStringIdToBuffer(userId)

    const user = await this.prismaService.user.findUnique({
      where: {
        id: bufferId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        pictureId: true,
        birthdate: true,
        about: true,
        instagram: true,
        _count: {
          select: {
            followees: true,
            followers: true,
          },
        },
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          select: {
            createdAt: true,
            id: true,
            tags: {
              select: {
                text: true,
                isLive: true,
              },
            },
            author: {
              select: {
                firstName: true,
                lastName: true,
                pictureId: true,
              },
            },
            text: true,
          },
        },
        userTraining: {
          select: {
            id: true,
            school: {
              select: {
                id: true,
                name: true,
                city: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            training: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return this.formatUser(user)
  }

  async getUserFollowers(id, currentCursor, limit = DEFAULT_LIMIT) {
    const bufferId = this.prismaService.mapStringIdToBuffer(id)

    const followers = await this.prismaService.followship.findMany({
      where: {
        followeeId: bufferId,
        ...(currentCursor && {
          cursor: {
            createdAt: new Date(+currentCursor).toISOString(),
          },
          skip: 1, // Skip the cursor
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        follower: {
          select: {
            id: true,
            firstName: true,
            pictureId: true,
            userTraining: {
              select: {
                school: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return followers.map(({ follower: { id, ...folower } }) => ({
      ...folower,
      id: this.prismaService.mapBufferIdToString(id),
    }))
  }

  async getUserFollowees(id, currentCursor, limit = DEFAULT_LIMIT) {
    const bufferId = this.prismaService.mapStringIdToBuffer(id)

    const followees = await this.prismaService.followship.findMany({
      where: {
        followerId: bufferId,
        ...(currentCursor && {
          cursor: {
            createdAt: new Date(+currentCursor).toISOString(),
          },
          skip: 1, // Skip the cursor
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        followee: {
          select: {
            id: true,
            firstName: true,
            pictureId: true,
            userTraining: {
              select: {
                school: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return followees.map(({ followee: { id, ...followee } }) => ({
      ...followee,
      id: this.prismaService.mapBufferIdToString(id),
    }))
  }

  async findMe(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: this.prismaService.mapStringIdToBuffer(userId),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        pictureId: true,
        birthdate: true,
        about: true,
        instagram: true,
        _count: {
          select: {
            followees: true,
            followers: true,
          },
        },
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
          select: {
            createdAt: true,
            id: true,
            tags: {
              select: {
                text: true,
                isLive: true,
              },
            },
            author: {
              select: {
                firstName: true,
                lastName: true,
                pictureId: true,
                id: true,
              },
            },
            text: true,
          },
        },
        userTraining: {
          select: {
            id: true,
            school: {
              select: {
                id: true,
                name: true,
                city: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            training: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundUserException()
    }
    return this.formatUser(user)
  }

  async requestResetPassword(email: string) {
    await this.findByEmail(email)

    const resetToken = this.generateResetToken()

    await this.prismaService.user.update({
      data: {
        resetToken,
      },
      where: {
        email,
      },
    })

    this.emailService.sendForgottenPasswordEmail(email, resetToken)

    return true
  }

  async create(createUserData: SignUpInput) {
    const saltOrRounds = 10
    const password = createUserData.password
    const hash = await bcrypt.hash(password, saltOrRounds)

    return this.prismaService.user.create({
      data: {
        id: this.prismaService.mapStringIdToBuffer(randomUUID()),
        email: createUserData.email,
        firstName: '',
        lastName: '',
        password: hash,
        roles: '[]',
        isVerified: true,
        isFilled: true,
        isActived: true,
      },
    })
  }

  async refreshSendbirdAccessToken(userId: string) {
    return this.sendbirdService.getAccessToken(userId)
  }

  private generateResetToken() {
    return randomBytes(5).toString('hex')
  }

  async deleteByEmail(email: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          email: email,
        },
      })
      return true
    } catch {
      throw new NotFoundUserException()
    }
  }

  async toggleFollow(authUserEmail: string, otherUserId: string, value: boolean) {
    const { id: authUserId } = await this.prismaService.user.findUnique({
      where: {
        email: authUserEmail,
      },
      select: {
        id: true,
      },
    })

    if (value) {
      await this.prismaService.followship.create({
        data: {
          followerId: authUserId,
          followeeId: this.prismaService.mapStringIdToBuffer(otherUserId),
        },
      })
    } else {
      await this.prismaService.followship.delete({
        where: {
          followerId_followeeId: {
            followerId: authUserId,
            followeeId: this.prismaService.mapStringIdToBuffer(otherUserId),
          },
        },
      })
    }

    return true
  }

  async syncUsersIndexWithAlgolia(user) {
    const usersIndex = this.algoliaService.initIndex('USERS')

    const newUserAlgoliaObject: UserIndexAlgoliaInterface = {
      id: this.prismaService.mapBufferIdToString(user.id),
      lastName: user.lastName,
      firstName: user.firstName,
      birthdateTimestamp: Date.parse(user.birthdate.toString()),
      hasPicture: user.pictureId != null,
      ...(user.userTraining && {
        training: {
          id: this.prismaService.mapBufferIdToString(user.userTraining.training.id),
          name: user.userTraining.training.name,
        },
      }),
      ...(user.userTraining && {
        school: {
          id: this.prismaService.mapBufferIdToString(user.userTraining.school.id),
          name: user.userTraining.school.name,
          postalCode: user.userTraining.school.postalCode,
          googlePlaceId: user.userTraining.school.googlePlaceId,
          city: {
            id: this.prismaService.mapBufferIdToString(user.userTraining.school.city.id),
            name: user.userTraining.school.city.name,
            googlePlaceId: user.userTraining.school.city.googlePlaceId,
            country: {
              id: this.prismaService.mapBufferIdToString(user.userTraining.school.city.country.id),
              name: user.userTraining.school.city.country.name,
            },
            _geoloc: {
              lat: user.userTraining.school.city.lat,
              lng: user.userTraining.school.city.lng,
            },
          },
          _geoloc: {
            lat: user.userTraining.school.lat,
            lng: user.userTraining.school.lng,
          },
        },
      }),
    }
    return this.algoliaService.saveObject(
      usersIndex,
      newUserAlgoliaObject,
      this.prismaService.mapBufferIdToString(user.id)
    )
  }

  async getSchool(schoolGooglePlaceId: string) {
    const school = await this.schoolService.findByGooglePlaceId(schoolGooglePlaceId)
    if (school) return school

    const googlePlaceDetail = await this.getGooglePlaceById(schoolGooglePlaceId)

    const locality = googlePlaceDetail.address_components.find((component) => component.types.includes('locality'))
    const postal_town = googlePlaceDetail.address_components.find((component) =>
      component.types.includes('postal_town')
    )

    if (!locality && !postal_town) throw new NotFoundException('city not found in google api')

    const { long_name: cityName } = locality || postal_town

    const googleCity = await this.getGoogleCityByName(cityName)
    const cityGooggleplaceDetail = await this.getGooglePlaceById(googleCity[0].place_id)
    return {
      name: googlePlaceDetail.name,
      googlePlaceId: googlePlaceDetail.place_id,
      lat: googlePlaceDetail.geometry.location.lat.toString(),
      lng: googlePlaceDetail.geometry.location.lng.toString(),
      city: {
        name: cityGooggleplaceDetail.name,
        googlePlaceId: cityGooggleplaceDetail.place_id,
        lat: cityGooggleplaceDetail.geometry.location.lat.toString(),
        lng: cityGooggleplaceDetail.geometry.location.lng.toString(),
        country: {
          name: cityGooggleplaceDetail.address_components.find((component) => component.types.includes('country'))
            .long_name,
        },
      },
    }
  }

  async signUp(signUpData: SignUpInput) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: signUpData.email,
      },
    })

    if (userExists) throw new ForbiddenException('Email exists')

    //const school = await this.getSchool(signUpData.schoolGooglePlaceId)

    const user = await this.create(signUpData)

    // this.syncUsersIndexWithAlgolia(user)
    const { access_token: sendbirdAccessToken } = await this.sendbirdService.createUser(user)

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      include: {
        userTraining: {
          include: {
            school: {
              include: {
                city: {
                  include: {
                    country: true,
                  },
                },
              },
            },
            training: true,
          },
        },
      },
      data: {
        sendbirdAccessToken,
      },
    })

    return {
      ...updatedUser,
      id: this.prismaService.mapBufferIdToString(updatedUser.id),
    }
  }

  async updateMe(updateUserData: UpdateUserInput, id: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: this.prismaService.mapStringIdToBuffer(id),
      },
    })

    if (!user) throw new ForbiddenException('User do not exists')

    const schoolData = await this.getSchool(updateUserData.schoolGooglePlaceId)

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...cleanUndefinedFromObj({
          firstName: updateUserData.firstName,
          lastName: updateUserData.lastName,
          email: updateUserData.email,
          password: updateUserData.password,
          birthdate: updateUserData.birthdate,
          instagram: updateUserData.instagram,
          snapchat: updateUserData.snapchat,
          pictureId: updateUserData.pictureId,
          expoPushNotificationToken: updateUserData.expoPushNotificationToken,
        }),
        ...(updateUserData.trainingName && {
          userTraining: {
            update: {
              school: {
                connectOrCreate: {
                  where: {
                    googlePlaceId: schoolData.googlePlaceId,
                  },
                  create: {
                    id: this.prismaService.mapStringIdToBuffer(randomUUID()),
                    name: schoolData.name,
                    googlePlaceId: schoolData.googlePlaceId,
                    isValid: true,
                    lat: schoolData.lat,
                    lng: schoolData.lng,
                    city: {
                      connectOrCreate: {
                        where: {
                          googlePlaceId: schoolData.city.googlePlaceId,
                        },
                        create: {
                          id: this.prismaService.mapStringIdToBuffer(randomUUID()),
                          name: schoolData.city.name,
                          googlePlaceId: schoolData.city.googlePlaceId,
                          lat: schoolData.city.lat,
                          lng: schoolData.city.lng,
                          isValid: true,
                          country: {
                            connectOrCreate: {
                              where: {
                                name: schoolData.city.country.name,
                              },
                              create: {
                                id: this.prismaService.mapStringIdToBuffer(randomUUID()),
                                name: schoolData.city.country.name,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              training: {
                connectOrCreate: {
                  where: {
                    name: updateUserData.trainingName,
                  },
                  create: {
                    id: this.prismaService.mapStringIdToBuffer(randomUUID()),
                    name: updateUserData.trainingName,
                  },
                },
              },
            },
          },
        }),
      },
    })

    return !!updatedUser.id
  }

  async getGooglePlaceById(googlePlaceId: string) {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json?language=fr&place_id=' +
        googlePlaceId +
        '&key=' +
        this.googleApiKey
    )
    if (response.data.status == 'INVALID_REQUEST' || typeof response.data.result == 'undefined')
      throw new NotFoundException('googlePlaceId not valid')
    return response.data.result as google.maps.places.PlaceResult
  }

  async getGoogleCityByName(cityName: string) {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        types: '(cities)',
        language: 'fr',
        input: cityName,
        key: this.googleApiKey,
      },
    })
    if (!data) throw new NotFoundException('city not found in goorgle api')
    return data.predictions as google.maps.places.AutocompletePrediction[]
  }

  formatUser(user) {
    const formattedUser = {
      ...user,
    }

    formattedUser.id = this.prismaService.mapBufferIdToString(user.id)

    if (formattedUser?.userTraining?.id) {
      formattedUser.userTraining.id = this.prismaService.mapBufferIdToString(user.userTraining.id)
    }

    if (formattedUser?.userTraining?.school?.id) {
      formattedUser.userTraining.school.id = this.prismaService.mapBufferIdToString(
        formattedUser.userTraining.school.id
      )
    }

    if (formattedUser?.userTraining?.school?.city?.id) {
      formattedUser.userTraining.school.city.id = this.prismaService.mapBufferIdToString(
        formattedUser.userTraining.school.city.id
      )
    }

    if (formattedUser?.userTraining?.training?.id) {
      formattedUser.userTraining.training.id = this.prismaService.mapBufferIdToString(
        formattedUser.userTraining.training.id
      )
    }

    formattedUser.followeesCount = user._count.followees
    formattedUser.followersCount = user._count.followers

    formattedUser.followees = user.followees
      ? user.followees.map((followee) => ({
          ...followee,
          id: this.prismaService.mapBufferIdToString(followee.id),
        }))
      : []

    formattedUser.followers = user.followers
      ? user.followers.map((follower) => ({
          ...follower,
          id: this.prismaService.mapBufferIdToString(follower.id),
        }))
      : []

    formattedUser.posts = user.posts
      ? user.posts.map((post) => ({
          ...post,
          author: {
            ...post.author,
            id: this.prismaService.mapBufferIdToString(post.author.id),
          },
        }))
      : []

    return formattedUser
  }
}
