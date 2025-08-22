import { INestApplication } from "@nestjs/common";

export const corsOption = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export const configureCORS = (app: INestApplication) => {
  app.enableCors(corsOption);
};
