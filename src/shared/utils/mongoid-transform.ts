import { MongoIdPipe } from "@shared/pipes/mongoid.pipe";
import { Transform } from "class-transformer";

export function MongoIdTransform() {
  const pipe = new MongoIdPipe();
  return Transform(({ value }) => {
    return pipe.transform(value);
  });
}
