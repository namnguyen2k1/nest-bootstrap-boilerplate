import { Module } from "@nestjs/common";
import { HttpClientModule } from "src/http-client/http-client.module";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
  imports: [HttpClientModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
