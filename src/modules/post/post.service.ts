import { Injectable } from '@nestjs/common';
import { JsonPlaceholderService } from 'src/http-client/third-part-services/json-placeholder/json-placeholder.service';

@Injectable()
export class PostService {
  constructor(private readonly jpService: JsonPlaceholderService) {}

  async getAllPosts(limit: number) {
    const res = await this.jpService.getAllPosts(limit);
    const posts = res.data;
    return posts;
  }

  async getPostById(postId: number) {
    const res = await this.jpService.getPostById(postId);
    const post = res.data;
    return post;
  }
}
