import { Module } from "@nestjs/common";
import { CachingModule } from "src/cache/caching.module";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

const PROVIDERS = [RoleService];

@Module({
  imports: [CachingModule],
  controllers: [RoleController],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class RoleModule {}
