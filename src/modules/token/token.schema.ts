import { SchemaFactory } from "@nestjs/mongoose";
import { Token } from "@token/token.model";
import { HydratedDocument } from "mongoose";
import { MongodbUtils } from "../../infrastructure/database/mongodb/mongodb.utils";

export type TokenDocument = HydratedDocument<Token>;

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.loadClass(Token);

MongodbUtils.customSchemaHooks({ schema: TokenSchema });
