import { SchemaFactory } from "@nestjs/mongoose";
import { TokenModel } from "@token/token.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../infrastructure/database/mongodb/mongodb.utils";

export type TokenDocument = HydratedDocument<TokenModel>;

export const TokenSchema = SchemaFactory.createForClass(TokenModel);

TokenSchema.loadClass(TokenModel);

MongodbUtils.customSchemaHooks({ schema: TokenSchema });
