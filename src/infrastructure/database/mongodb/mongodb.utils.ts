import { Schema, SchemaOptions } from "mongoose";
import { DEFAULT_QUERY_MIDDLEWARES, DEFAULT_READ_PREFERENCE_MODE } from "./constant";

export class MongodbUtils {
  static createSchemaOptions({ collection }: { collection: string }) {
    const options: SchemaOptions = {
      collection,
      autoCreate: true,
      autoIndex: false,
      minimize: false,
      toObject: {
        getters: true,
        virtuals: true,
        versionKey: false,
        transform: function (doc, record, game) {
          (record as any).id = record._id;
          delete (record as any)?._id;
        },
      },
      toJSON: {
        getters: true,
        virtuals: true,
        versionKey: false,
        transform: function (doc, record, game) {
          (record as any).id = record._id;
          delete (record as any)?._id;
        },
      },
      validateBeforeSave: true,
      versionKey: false,
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    };
    return options;
  }

  static customSchemaHooks({ schema }: { schema: Schema }) {
    schema.pre(DEFAULT_QUERY_MIDDLEWARES, async function (next) {
      const that = this as any;
      if (!that.options?.session) {
        that.options.readPreference = that.options.readPreference || DEFAULT_READ_PREFERENCE_MODE;
      }
      // if (that._mongooseOptions && that._mongooseOptions.lean === undefined) {
      //   that._mongooseOptions.lean = true;
      // }
      return next();
    });
    schema.pre("aggregate", async function (next) {
      const that = this as any;
      if (!that.options?.session) {
        that.options.readPreference = that.options.readPreference || DEFAULT_READ_PREFERENCE_MODE;
      }
      return next();
    });
  }
}
