import { Injectable } from '@nestjs/common';
import { CreatePostInput } from '../input-types/tag.input-types';
import { Post } from '../models/post.model';

@Injectable()
export class PostService {
  private posts: Post[] = [
    {
      id: 1,
      text: 'post title 1',
      userId: 123,
      date: '0000',
      tags: [
        {
          id: 1,
          text: 'tag-1',
          owner: {
            id: 123,
          }
        },
      ],
    },
    {
      id: 2,
      text: 'post title 2',
      userId: 234,
      date: '1111',
      tags: [
        {
          id: 1,
          text: 'tag-2',
          owner: {
            id: 234,
          },
        },
      ],
    },
  ];
  findByTag(tagText: string): Post[] {
    return this.posts.filter((post) => {
      for (const tag of post.tags) {
        if (tag.text === tagText) {
          return true;
        }

        return false;
      }
    });
  }

  create(createPostInput: CreatePostInput) {
    // TODO: Check if the tag already exists.. if not exists generate the new one { owner: userId, text: tag}, if already exists add the new relation with the new post

    // await this.tagService.findOrFail({text: createPostInput.tag});

    const newPost: Post = {
      id: (Math.floor(Math.random() * 100) + 1),
      text: createPostInput.text,
      userId: createPostInput.userId,
      date: new Date().toDateString(),
      tags: [
        {
          id: 123,
          text: createPostInput.tag,
          owner: {
            id: 123,
          },
        },
      ],
    };
    this.posts.push(newPost);

    return newPost;
  }
}
