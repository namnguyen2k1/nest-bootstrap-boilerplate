import { Injectable } from "@nestjs/common";
import { HttpClientService } from "src/http-client/http-client.service";

@Injectable()
export class JsonPlaceholderService {
  private readonly baseUrl = `https://jsonplaceholder.typicode.com`;

  constructor(private readonly http: HttpClientService) {}

  async getAllPosts(limit: number) {
    return this.http.get(`${this.baseUrl}/posts?_limit=${limit}`);
  }

  async getPostById(postId: number) {
    return this.http.get(`${this.baseUrl}/posts/${postId}`);
  }
}
