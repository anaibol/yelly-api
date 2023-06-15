/* eslint-disable functional/immutable-data */
import { Injectable, OnModuleInit } from '@nestjs/common'
import { Post, User } from '@prisma/client'
import axios from 'axios'

import { Tag } from '../tag/tag.model'

const BODYGUARD_API = 'https://bamboo.bodyguard.ai/api/analyze'
const COMMENT_2006_AND_BELOW_CHANNEL_ID = 'b720a421-b277-4467-8b97-92dba9920a74'
const COMMENT_2007_AND_ABOVE_CHANNEL_ID = 'a77837b5-24f2-4759-98b7-5519a22ef1db'
const TOPIC_2006_AND_BELOW_CHANNEL_ID = '411ebb5b-5dc5-45a9-aa4c-399406b56123'
const TOPIC_2007_AND_ABOVE_CHANNEL_ID = '0edbeba2-894a-4866-8f7c-4cb12d652ea3'
// const fifteenYoYear = 2007

@Injectable()
export class BodyguardService implements OnModuleInit {
  apiKey2006AndBelow: string
  apiKey2007AndAbove: string

  // eslint-disable-next-line functional/no-return-void
  onModuleInit() {
    if (process.env.BODYGUARD_2006_AND_BELOW_API_KEY === undefined) {
      console.warn('BodyguardService', 'BODYGUARD_2006_AND_BELOW_API_KEY is undefined')
      return
    }
    if (process.env.BODYGUARD_2007_AND_ABOVE_API_KEY === undefined) {
      console.warn('BodyguardService', 'BODYGUARD_2007_AND_ABOVE_API_KEY is undefined')
      return
    }
    this.apiKey2006AndBelow = process.env.BODYGUARD_2006_AND_BELOW_API_KEY
    this.apiKey2007AndAbove = process.env.BODYGUARD_2007_AND_ABOVE_API_KEY
  }

  async analyseTopic(tag: Tag, author: User): Promise<void> {
    // if (!author?.birthdate) {
    //   return
    // }
    // const isLessThanFifteen = author.birthdate.getFullYear() >= fifteenYoYear
    const isLessThanFifteen = false
    const channelId = isLessThanFifteen ? TOPIC_2007_AND_ABOVE_CHANNEL_ID : TOPIC_2006_AND_BELOW_CHANNEL_ID
    const apiKey = isLessThanFifteen ? this.apiKey2007AndAbove : this.apiKey2006AndBelow
    return this.analyse(apiKey, channelId, tag.text, author)
  }

  async analyseComment(comment: Post, author: User, post: Tag): Promise<void> {
    // if (!author.birthdate || !comment.text) {
    //   return
    // }
    //const isLessThanFifteen = author.birthdate.getFullYear() >= fifteenYoYear
    const isLessThanFifteen = false
    const channelId = isLessThanFifteen ? COMMENT_2007_AND_ABOVE_CHANNEL_ID : COMMENT_2006_AND_BELOW_CHANNEL_ID
    const apiKey = isLessThanFifteen ? this.apiKey2007AndAbove : this.apiKey2006AndBelow
    return this.analyse(apiKey, channelId, comment.text ?? '', author, post)
  }

  async analyse(apiKey: string, channelId: string, text: string, author: User, post?: Tag) {
    // eslint-disable-next-line functional/no-try-statement
    try {
      const response = await axios.post(
        BODYGUARD_API,
        {
          channelId,
          contents: [
            {
              text,
              context: {
                from: {
                  type: 'AUTHOR',
                  data: {
                    identifier: author.id,
                    username: author.username,
                    profilePictureURL: 'http://yelly.imgix.net/' + author.pictureId,
                  },
                },
                post: post
                  ? {
                      type: 'TEXT',
                      data: {
                        identifier: post.id,
                        title: post.text,
                        publishedAt: post.createdAt?.toISOString(),
                      },
                    }
                  : undefined,
              },
            },
          ],
        },
        {
          headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json',
          },
        }
      )
      console.log('BodyguardService:analyse:response', { channelId, text, response: response.data.data })
    } catch (error) {
      console.error('BodyguardService:analyse:error', { channelId, text, error })
    }
  }
}
