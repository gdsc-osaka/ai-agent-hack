import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema/app",
    out: "./sql/01_app",
    dbCredentials: {
        host: "localhost",
        port: 5432,
        user: "user",
        password: "password",
        database: "db",
        ssl: false
    }
});
