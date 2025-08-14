import { PublicAPI } from '@auth/decorators/public-api.decorator';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from '@shared/decorators/swagger-response';
import { NoCache } from 'src/shared/decorators/no-cache.decorator';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  @SwaggerResponse({
    public: true,
    pick: [HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.TOO_MANY_REQUESTS],
    description: 'Get all posts successfully',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    default: 20,
  })
  async getAllPosts(@Query('limit', ParseIntPipe) limit: number) {
    const posts = await this.postService.getAllPosts(limit);
    return {
      _message: 'Get all posts successfully',
      data: posts,
    };
  }

  @Get(':postId')
  @PublicAPI()
  @NoCache()
  @Version('1')
  @ApiOperation({ summary: 'no cache' })
  async getPostById(@Param('postId', ParseIntPipe) postId: number) {
    const post = await this.postService.getPostById(postId);
    return {
      _message: 'Get post successfully',
      data: post,
    };
  }

  @Get(':postId')
  @PublicAPI()
  @Version('2')
  @ApiOperation({ summary: 'enable cache' })
  async getPostById2(@Param('postId', ParseIntPipe) postId: number) {
    const post = await this.postService.getPostById(postId);
    return {
      _message: 'Get post successfully',
      data: post,
    };
  }
}
