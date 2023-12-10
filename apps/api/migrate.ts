import mongoose from "mongoose";
import { AppConfig } from "./src/app.config";

console.log(AppConfig.mongoose.mongoUri);
export default {
  uri: AppConfig.mongoose.mongoUri,
  collection: "migrations",
  migrationsPath: "./migrations",
  templatePath: "./migrations/template.ts",
  autosync: false,
};
// bug: see https://github.com/balmasi/migrate-mongoose/issues/45#issuecomment-532322882
mongoose.connect(AppConfig.mongoose.mongoUri)
